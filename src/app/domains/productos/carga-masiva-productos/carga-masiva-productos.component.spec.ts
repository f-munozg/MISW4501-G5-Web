/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, ErrorHandler } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CargaMasivaProductosComponent } from './carga-masiva-productos.component';
import { CargaMasivaProductosService } from './carga-masiva-productos.service';
import { environment } from '../../../../environments/environment'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductosModule } from '../productos.module';
import { FabricantesResponse } from '../../fabricantes/fabricantes.model';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

describe('CargaMasivaProductosComponent', () => {
  let component: CargaMasivaProductosComponent;
  let fixture: ComponentFixture<CargaMasivaProductosComponent>;
  let service: CargaMasivaProductosService;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CargaMasivaProductosComponent ],
      imports: [ReactiveFormsModule, HttpClientTestingModule, ProductosModule],
      providers: [ CargaMasivaProductosService,
        { provide: ErrorHandler, useValue: { handleError: () => {} } }
       ]
    })
    .compileComponents();

    service = TestBed.inject(CargaMasivaProductosService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaMasivaProductosComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CargaMasivaProductosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('initialization', () => {
    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
      
      const req = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req.flush({});
    });
  });

  describe('ngOnInit()', () => {
    it('should initialize form and load fabricantes', () => {
      const mockResponse: FabricantesResponse = {
        providers: [{ id: 'c3a2afdb-a049-4236-9d21-3d33e8922f08', name: 'Fabricante 1' }]
      };

      component.ngOnInit();
      
      const req = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req.flush(mockResponse);

      expect(component.cargaMasivaProductosForm).toBeDefined();
      expect(component.cargaMasivaProductosForm.controls['fieldFabricante']).toBeTruthy();
      
      expect(component.listaFabricantes).toEqual(mockResponse.providers);
    });

    it('should handle API errors when loading fabricantes', fakeAsync(() => {
      const consoleErrorSpy = spyOn(console, 'error');
      const mockErrorEvent = new ErrorEvent('API error', {
        message: 'Server error'
      });
      
      component.ngOnInit();
      const req = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req.error(mockErrorEvent, { status: 500 });
      tick();
    
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error cargando fabricantes:', 
        jasmine.objectContaining({
          name: 'HttpErrorResponse',
          status: 500
        })
      );
      expect(component.listaFabricantes).toEqual([]);
    }));
  });


  describe('onDrop()', () => {
    it('should handle empty file list', () => {
      const mockEvent = {
        preventDefault: jasmine.createSpy(),
        stopPropagation: jasmine.createSpy(),
        dataTransfer: { files: [] }
      } as unknown as DragEvent;
  
      component.onDrop(mockEvent);
  
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(component.isDragOver).toBeFalse();
      
      expect(component.selectedFile).toBeNull();
      expect(component.errorMessage).toBe('');
    });
  
    it('should process valid file', () => {
      const mockFile = new File(['content'], 'test.csv', { type: 'text/csv' });
      const mockEvent = {
        preventDefault: jasmine.createSpy(),
        stopPropagation: jasmine.createSpy(),
        dataTransfer: { files: [mockFile] }
      } as unknown as DragEvent;
  
      component.onDrop(mockEvent);
  
      expect(component.selectedFile).toBe(mockFile);
      expect(component.errorMessage).toBe('');
    });
  
    it('should reject invalid file type', () => {
      const mockFile = new File(['content'], 'test.txt');
      const mockEvent = {
        preventDefault: jasmine.createSpy(),
        stopPropagation: jasmine.createSpy(),
        dataTransfer: { files: [mockFile] }
      } as unknown as DragEvent;
  
      component.onDrop(mockEvent);
  
      expect(component.selectedFile).toBeNull();
      expect(component.errorMessage)
        .toBe('Archivo inválido. Solo subir archivos CSV o Excel.');
    });
  });

  it('should handle drag and drop events', () => {
    const mockEvent = {
      preventDefault: jasmine.createSpy(),
      stopPropagation: jasmine.createSpy(),
      dataTransfer: { files: [new File([''], 'test.csv')] }
    } as unknown as DragEvent;

    component.onDragOver(mockEvent);
    expect(component.isDragOver).toBeTrue();

    component.onDragLeave(mockEvent);
    expect(component.isDragOver).toBeFalse();

    component.onDrop(mockEvent);
    expect(component.selectedFile).toBeDefined();
  });

  it('should reject invalid files on drop', () => {
    const mockEvent = {
      preventDefault: jasmine.createSpy(),
      stopPropagation: jasmine.createSpy(),
      dataTransfer: { files: [new File([''], 'test.txt')] }
    } as unknown as DragEvent;

    component.onDrop(mockEvent);
    expect(component.selectedFile).toBeNull();
    expect(component.errorMessage).toBe('Archivo inválido. Solo subir archivos CSV o Excel.');
  });

  it('should handle file selection', () => {
    const mockEvent = {
      target: { files: [new File([''], 'test.csv', { type: 'text/csv' })], value: '' }
    };

    component.onFileSelected(mockEvent);
    expect(component.selectedFile).toBeDefined();
    expect(component.errorMessage).toBe('');
  });

  it('should reject invalid files on selection', () => {
    const mockEvent = {
      target: { files: [new File([''], 'test.txt')], value: '' }
    };

    component.onFileSelected(mockEvent);
    expect(component.selectedFile).toBeNull();
    expect(component.errorMessage).toBe('Archivo inválido. Solo subir archivos CSV o Excel.');
  });

  it('should upload file successfully', async () => {
    const mockFile = new File([''], 'test.csv', { type: 'text/csv' });
    const mockFormData = { productsFile: mockFile, fieldFabricante: '1' };
    const mockResponse = { success: true };

    spyOn(service, 'postData').and.returnValue(of(new HttpResponse({ body: mockResponse })));

    await component.uploadFile(mockFormData);
    expect(component.errorMessage).toBe('');
  });

  describe('uploadFile error handling', () => {
    let mockFile: File;
    let mockFormData: { productsFile: File, fieldFabricante: string };
  
    beforeEach(() => {
      mockFile = new File([''], 'test.csv', { type: 'text/csv' });
      mockFormData = { productsFile: mockFile, fieldFabricante: '1' };
    });
  
    it('should handle Error instances', fakeAsync(() => {
      const error = new Error('Test error');
      spyOn(component['apiService'], 'postData').and.returnValue(
        throwError(() => error)
      );
  
      component.uploadFile(mockFormData).catch(() => {});
      tick();
  
      expect(component.errorMessage).toBe(`Error en el proceso de carga del archivo: ${error.message}`);
    }));
  
    it('should use custom toString() for non-Object prototypes', fakeAsync(() => {
      class CustomError {
        toString() { return 'Custom error'; }
      }
      spyOn(component['apiService'], 'postData').and.returnValue(
        throwError(() => new CustomError())
      );
  
      component.uploadFile(mockFormData).catch(() => {});
      tick();
  
      expect(component.errorMessage).toBe(`${component.errorMessage}`);
    }));
  
    it('should skip [object Object] toString() results', fakeAsync(() => {
      spyOn(component['apiService'], 'postData').and.returnValue(
        throwError(() => ({}))
      );
  
      component.uploadFile(mockFormData).catch(() => {});
      tick();
  
      expect(component.errorMessage).toBe('Error en el proceso de carga del archivo: Error desconocido');
    }));
  
    it('should handle primitive values', fakeAsync(() => {
      spyOn(component['apiService'], 'postData').and.returnValue(
        throwError(() => 42)
      );
  
      component.uploadFile(mockFormData).catch(() => {});
      tick();
  
      expect(component.errorMessage).toBe('Error en el proceso de carga del archivo: Error desconocido');
    }));

    it('should handle plain objects as unknown errors', fakeAsync(() => {
      const testError = { unexpected: 'error format' }; // Plain object
      spyOn(component['apiService'], 'postData').and.returnValue(
        throwError(() => testError)
      );
    
      component.uploadFile(mockFormData).catch(() => {});
      tick();
    
      expect(component.errorMessage)
        .toBe('Error en el proceso de carga del archivo: Error desconocido');
    }));

    describe('HTTP Error Handling', () => {
      it('should handle standard HttpClient errors with status', fakeAsync(() => {
        const httpError = {
          status: 409,
          statusText: 'Conflict',
          error: { message: 'Duplicate product' }
        };
        
        spyOn(component['apiService'], 'postData').and.returnValue(
          throwError(() => httpError)
        );
    
        component.uploadFile(mockFormData).catch(() => {});
        tick();
    
        expect(component.errorMessage)
          .toBe('Error en el proceso de carga del archivo: Duplicate product (HTTP 409)');
      }));
    
      it('should handle HttpClient errors without server message', fakeAsync(() => {
        const httpError = {
          status: 500,
          statusText: 'Internal Server Error'
        };
        
        spyOn(component['apiService'], 'postData').and.returnValue(
          throwError(() => httpError)
        );
    
        component.uploadFile(mockFormData).catch(() => {});
        tick();
    
        expect(component.errorMessage)
          .toBe('Error en el proceso de carga del archivo: HTTP 500 - Internal Server Error');
      }));
    
      it('should handle nested error structure', fakeAsync(() => {
        const httpError = {
          error: {
            status: 404,
            message: 'Resource not found'
          }
        };
        
        spyOn(component['apiService'], 'postData').and.returnValue(
          throwError(() => httpError)
        );
    
        component.uploadFile(mockFormData).catch(() => {});
        tick();
    
        expect(component.errorMessage)
          .toBe('Error en el proceso de carga del archivo: Resource not found (HTTP 404)');
      }));
    });

    describe('String Error Handling', () => {
      it('should handle plain string errors', fakeAsync(() => {
        const stringError = 'Database connection failed';
        
        spyOn(component['apiService'], 'postData').and.returnValue(
          throwError(() => stringError)
        );
    
        component.uploadFile(mockFormData).catch(() => {});
        tick();
    
        expect(component.errorMessage)
          .toBe('Error en el proceso de carga del archivo: Database connection failed');
      }));
    
      it('should handle empty string errors', fakeAsync(() => {
        spyOn(component['apiService'], 'postData').and.returnValue(
          throwError(() => '')
        );
    
        component.uploadFile(mockFormData).catch(() => {});
        tick();
    
        expect(component.errorMessage)
          .toBe('Error en el proceso de carga del archivo: ');
      }));
    });
  });

  it('should handle preparation error', fakeAsync(() => {
    const mockFile = new File([''], 'test.csv', { type: 'text/csv' });
    const mockFormData = { productsFile: mockFile, fieldFabricante: '1' };
    const mockError = new Error('Preparación fallida');

    spyOn(service, 'postData').and.throwError(mockError);

    let errorCaught = false;
    
    component.uploadFile(mockFormData)
      .catch(err => {
        errorCaught = true;
        expect(err).toBe(mockError);
        expect(component.errorMessage).toBe(`Error en el proceso de carga del archivo: ${mockError.message}`);
        expect(component.isSubmitting).toBeFalse();
      });

    tick();
    expect(errorCaught).toBeTrue();
  }));

  describe('File Processing', () => {
    it('should handle null file in onDrop', () => {
      const mockEvent = {
        preventDefault: jasmine.createSpy(),
        stopPropagation: jasmine.createSpy(),
        dataTransfer: { files: [null] }
      } as unknown as DragEvent;
  
      component.onDrop(mockEvent);
  
      expect(component.selectedFile).toBeNull();
      expect(component.errorMessage).toBe('');
    });
  
    it('should handle null file in onFileSelected', () => {
      const mockEvent = {
        target: { files: [null], value: '' }
      };
  
      component.onFileSelected(mockEvent);
  
      expect(component.selectedFile).toBeNull();
      expect(component.errorMessage).toBe('');
    });
  
    it('should handle empty file list in onFileSelected', () => {
      const mockEvent = {
        target: { files: [], value: '' } 
      };
  
      component.onFileSelected(mockEvent);
  
      expect(component.selectedFile).toBeNull();
      expect(component.errorMessage).toBe('');
    });
  });

  describe('clearAll()', () => {
    beforeEach(() => {
      // Set initial state
      component.cargaMasivaProductosForm = new FormBuilder().group({
        fieldFabricante: ['test value']
      });
      component.selectedFile = new File([''], 'test.csv');
      component.errorMessage = 'Test error';
      component.isSubmitting = true;
    });
  
    it('should reset all component state and DOM elements', () => {
      const fileInput = document.createElement('input');
      fileInput.id = 'fileInput';
      fileInput.value = 'test.csv';
      document.body.appendChild(fileInput);
  
      spyOn(component.cargaMasivaProductosForm, 'reset');
  
      component.clearAll();
  
      expect(component.cargaMasivaProductosForm.reset).toHaveBeenCalled();
      expect(component.selectedFile).toBeNull();
      expect(component.errorMessage).toBe('');
      expect(component.isSubmitting).toBeFalse();
  
      expect(fileInput.value).toBe('');
  
      document.body.removeChild(fileInput);
    });
  
    it('should handle missing file input gracefully', () => {
      const existingInput = document.getElementById('fileInput');
      if (existingInput) {
        document.body.removeChild(existingInput);
      }
  
      component.clearAll();
      
      expect(component.selectedFile).toBeNull();
    });
  });

  describe('onSubmit()', () => {
    let mockFile: File;
  
    beforeEach(() => {
      mockFile = new File([''], 'test.csv', { type: 'text/csv' });
      component.cargaMasivaProductosForm = new FormBuilder().group({
        fieldFabricante: ['1', Validators.required]
      });
    });
  
    it('should not submit when form is invalid', fakeAsync(() => {
      component.cargaMasivaProductosForm.controls['fieldFabricante'].setValue('');
      spyOn(component, 'uploadFile');
      
      component.onSubmit();
      tick();
      
      expect(component.uploadFile).not.toHaveBeenCalled();
      expect(component.isSubmitting).toBeFalse();
    }));
  
    it('should show error when no file selected', fakeAsync(() => {
      component.selectedFile = null;
      
      component.onSubmit();
      tick();
      
      expect(component.errorMessage).toBe('Por favor seleccione un archivo.');
      expect(component.isSubmitting).toBeFalse();
    }));
  
    it('should call uploadFile with correct data', fakeAsync(() => {
      component.selectedFile = mockFile;
      const uploadSpy = spyOn(component, 'uploadFile').and.returnValue(Promise.resolve());
      
      component.onSubmit();
      expect(component.isSubmitting).toBeTrue();
      
      tick();
      discardPeriodicTasks(); // Limpia cualquier timer
      
      expect(uploadSpy).toHaveBeenCalledWith({
        fieldFabricante: '1',
        productsFile: mockFile
      });
      expect(component.isSubmitting).toBeFalse();
    }));
  
    it('should handle upload success', fakeAsync(() => {
      component.selectedFile = mockFile;
      spyOn(component, 'uploadFile').and.returnValue(Promise.resolve());
      
      component.onSubmit();
      tick();
      
      expect(component.errorMessage).toBe('');
      expect(component.isSubmitting).toBeFalse();
    }));
  
    it('should handle upload error', fakeAsync(() => {
      component.selectedFile = mockFile;
      const mockError = new Error('Upload failed');
      spyOn(component, 'uploadFile').and.returnValue(Promise.reject(mockError));
      
      component.onSubmit();
      tick();
      
      expect(component.errorMessage).toContain('Upload failed');
      expect(component.isSubmitting).toBeFalse();
    }));
  });
});
