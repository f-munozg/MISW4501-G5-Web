import { TestBed, waitForAsync, inject, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { CargaProductoService } from './carga-producto.service';
import { CargaProductoComponent } from './carga-producto.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { ProductosModule } from '../productos.module';
import { environment } from '../../../../environments/environment'
import { ProductosResponse } from '../producto.model';

describe('CargaProductoComponent', () => {
  let component: CargaProductoComponent;
  let fixture: ComponentFixture<CargaProductoComponent>;
  let service: CargaProductoService;
  let httpMock: HttpTestingController;
  let apiUrl = environment.apiUrlProducts + `/products/add`;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [CargaProductoComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, ProductosModule],
      providers: [CargaProductoService]
    }).compileComponents();

    service = TestBed.inject(CargaProductoService);
    httpMock = TestBed.inject(HttpTestingController);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Verify no unmatched requests are outstanding
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
    req.flush({});
  });

  describe('clearAll', () => {
    it('should reset to original values in edit mode when originalFormValues exists', () => {
      component.isEditMode = true;
      component.originalFormValues = {
        sku: 'ORIG-SKU',
        provider_id: 'original-provider',
        unit_value: 999,
        estimated_delivery_time: '2025-01-01T00:00:00',
        storage_conditions: 'Original conditions',
        category: 'alimentación',
        product_features: 'Original features',
        description: 'Original description',
        name: 'Original Product'
      };
  
      component.cargaProductoForm.patchValue({
        fieldCodigo: 'MODIFIED-SKU',
        fieldFabricante: 'modified-provider',
        fieldValor: 100,
        fieldFechaVencimiento: new Date('2023-01-01'),
        fieldCondicionesAlmacenamiento: 'Modified conditions',
        fieldCategoria: 'ROPA',
        fieldCaracteristicas: 'Modified features',
        fieldDescripcion: 'Modified description',
        fieldNombre: 'Modified Product'
      });
  
      component.selectedFile = new File(['test'], 'test.png');
  
      component.clearAll();
  
      expect(component.cargaProductoForm.value).toEqual({
        fieldCodigo: 'ORIG-SKU',
        fieldFabricante: 'original-provider',
        fieldValor: 999,
        fieldFechaVencimiento: new Date('2025-01-01T00:00:00'),
        fieldCondicionesAlmacenamiento: 'Original conditions',
        fieldCategoria: 'Alimentación',
        fieldCaracteristicas: 'Original features',
        fieldDescripcion: 'Original description',
        fieldNombre: 'Original Product'
      });
  
      expect(component.selectedFile).toBeNull();
  
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    });
  
    it('should clear file input when it exists', () => {
      const fileInput = document.createElement('input');
      fileInput.id = 'fileInput';
      fileInput.value = 'test.png';
      spyOn(document, 'getElementById').and.returnValue(fileInput);
  
      component.clearAll();
  
      expect(fileInput.value).toBe('');
  
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    });
  
    it('should handle case when file input does not exist without errors', () => {
      spyOn(document, 'getElementById').and.returnValue(null);
      
      const originalFormValues = {
        fieldCodigo: null,
        fieldFabricante: null,
        fieldValor: null,
        fieldFechaVencimiento: null,
        fieldCondicionesAlmacenamiento: null,
        fieldCategoria: null,
        fieldCaracteristicas: null,
        fieldDescripcion: null,
        fieldNombre: null
      };
      
      component.clearAll();

      expect(() => component.clearAll()).not.toThrow();
      expect(component.cargaProductoForm.value).toEqual(originalFormValues);
      expect(component.selectedFile).toBeNull();
      
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    });
  
    it('should completely reset form when not in edit mode', () => {
      component.isEditMode = false;
      component.originalFormValues = null;
  
      component.cargaProductoForm.patchValue({
        fieldCodigo: 'TEST-SKU',
        fieldFabricante: 'test-provider',
        fieldValor: 100,
        fieldFechaVencimiento: new Date('2023-01-01'),
        fieldCondicionesAlmacenamiento: 'Test conditions',
        fieldCategoria: 'ROPA',
        fieldCaracteristicas: 'Test features',
        fieldDescripcion: 'Test description',
        fieldNombre: 'Test Product'
      });
  
      component.selectedFile = new File(['test'], 'test.png');
  
      component.clearAll();
  
      expect(component.cargaProductoForm.value).toEqual({
        fieldCodigo: null,
        fieldFabricante: null,
        fieldValor: null,
        fieldFechaVencimiento: null,
        fieldCondicionesAlmacenamiento: null,
        fieldCategoria: null,
        fieldCaracteristicas: null,
        fieldDescripcion: null,
        fieldNombre: null
      });
  
      expect(component.selectedFile).toBeNull();
  
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    });
  });

  it('should handle file selection', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;
    
    component.onFileSelected(event);
    expect(component.selectedFile).toBe(file);

    const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
    req.flush({});
  });

  it('should not set file when no files are selected', () => {
    const event = { target: { files: [] } } as unknown as Event;
    component.onFileSelected(event);
    expect(component.selectedFile).toBeNull();

    const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
    req.flush({});
  });

  it('should format Date object correctly', () => {
    const testDate = new Date(2025, 3, 6); // Abril 6, 2025
    const result = component.formatDateToISOWithTime(testDate);
    expect(result).toBe('2025-04-06T00:00:00');

    const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
    req.flush({});
  });

  it('should format date string correctly', () => {
    const dateString = '2025-04-06';
    const result = component.formatDateToISOWithTime(dateString);
    expect(result).toBe('2025-04-06T00:00:00');
  
    const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
    req.flush({});
  });

  it('should handle single-digit months and days', () => {
    const testDate = new Date(2025, 0, 1); // Enero 1, 2025
    const result = component.formatDateToISOWithTime(testDate);
    expect(result).toBe('2025-01-01T00:00:00');
  
    const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
    req.flush({});
  });

  it('should pad hours, minutes and seconds with zeros', () => {
    const testDate = new Date(2025, 5, 15);
    const result = component.formatDateToISOWithTime(testDate);
    expect(result.endsWith('T00:00:00')).toBeTrue();
  
    const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
    req.flush({});
  });

  it('should convert string to Date object', () => {
    const dateString = 'April 6, 2025';
    const result = component.formatDateToISOWithTime(dateString);
    expect(result).toBe('2025-04-06T00:00:00');
  
    const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
    req.flush({});
  });

  it('should handle ISO string input', () => {
    const isoString = '2025-04-06T14:30:00Z';
    const result = component.formatDateToISOWithTime(isoString);
    expect(result).toBe('2025-04-06T00:00:00');
  
    const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
    req.flush({});
  });

  it('should throw error for invalid date string', () => {
    expect(() => component.formatDateToISOWithTime('invalid-date')).toThrow();
  
    const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
    req.flush({});
  });

  describe('cargarInformacionProducto', () => {
    it('should load product information in edit mode', fakeAsync(() => {
      component.isEditMode = true;
      component.idProducto = 'test-product-id';
      
      const mockProduct = {
        id: 'test-product-id',
        sku: 'TEST-SKU',
        provider_id: 'test-provider-id',
        unit_value: 100,
        estimated_delivery_time: '2025-12-31T00:00:00',
        storage_conditions: 'Dry place',
        category: 'alimentación',
        product_features: 'Test features',
        description: 'Test description',
        name: 'Test Product'
      };
    
      spyOn(service, 'getProductos').and.returnValue(of({
        products: [mockProduct]
      } as ProductosResponse));
    
      component.cargarInformacionProducto();
      tick();
    
      expect(component.cargaProductoForm.value).toEqual({
        fieldCodigo: 'TEST-SKU',
        fieldFabricante: 'test-provider-id',
        fieldValor: 100,
        fieldFechaVencimiento: new Date('2025-12-31T00:00:00'),
        fieldCondicionesAlmacenamiento: 'Dry place',
        fieldCategoria: 'Alimentación',
        fieldCaracteristicas: 'Test features',
        fieldDescripcion: 'Test description',
        fieldNombre: 'Test Product'
      });
    
      expect(component.originalFormValues).toEqual(mockProduct);
    
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    }));
    
    it('should handle error when loading product information', fakeAsync(() => {
      component.isEditMode = true;
      component.idProducto = 'test-product-id';
      
      const errorResponse = new Error('Failed to load product');
      spyOn(service, 'getProductos').and.returnValue(throwError(() => errorResponse));
      spyOn(console, 'error');
    
      component.cargarInformacionProducto();
      tick();
    
      expect(console.error).toHaveBeenCalledWith('Error loading product:', errorResponse);
    
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    }));
    
    it('should handle case when product is not found', fakeAsync(() => {
      component.isEditMode = true;
      component.idProducto = 'non-existent-id';
      
      spyOn(service, 'getProductos').and.returnValue(of({
        products: []
      } as ProductosResponse));
      spyOn(console, 'error');
    
      component.cargarInformacionProducto();
      tick();
    
      expect(console.error).toHaveBeenCalledWith('Product not found');
    
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    }));
  })

  describe('onSubmit', () => {
    beforeEach(() => {
      component.cargaProductoForm.patchValue({
        fieldCodigo: 'SKU-456',
        fieldFabricante: '1e1f9b23-8f78-4e02-9afa-0cd4d0e51680',
        fieldValor: '15000',
        fieldFechaVencimiento: new Date('2023-01-01'),
        fieldCondicionesAlmacenamiento: 'Probando',
        fieldCategoria: 'ALIMENTACIÓN',
        fieldCaracteristicas: 'Probando',
        fieldDescripcion: 'Probando',
        fieldNombre: 'Arroz'
      });
      component.selectedFile = new File(['test'], 'test.png', { type: 'image/png' });
    });

    it('should not submit when form is invalid', () => {
      component.cargaProductoForm.patchValue({
        fieldCodigo: '', 
        fieldNombre: ''  
      });

      spyOn(service, 'postData');
      spyOn(service, 'updateProducto');
    
      component.onSubmit();
      
      expect(service.postData).not.toHaveBeenCalled();
      expect(service.updateProducto).not.toHaveBeenCalled();
      expect(component.isSubmitting).toBeFalse();
  
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    });
  
    it('should format date before submission', () => {
      component.cargaProductoForm.patchValue({
        fieldCodigo: 'SKU-456',
        fieldFabricante: '1e1f9b23-8f78-4e02-9afa-0cd4d0e51680',
        fieldValor: '15000',
        fieldFechaVencimiento: new Date('2023-01-01'),
        fieldCondicionesAlmacenamiento: 'Probando',
        fieldCategoria: 'ALIMENTACIÓN',
        fieldCaracteristicas: 'Probando',
        fieldDescripcion: 'Probando',
        fieldNombre: 'Arroz'
      });
      
      const testFile = new File(['test'], 'test.png', { type: 'image/png' });
      component.selectedFile = testFile;
      
      spyOn(component, 'formatDateToISOWithTime').and.callThrough();
      spyOn(service, 'postData').and.returnValue(Promise.resolve(of({})));
      
      component.onSubmit();
      
      expect(component.formatDateToISOWithTime).toHaveBeenCalled();
  
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    });
  
    it('should handle successful submission', fakeAsync(() => {
      component.cargaProductoForm.patchValue({
        fieldCodigo: 'SKU-456',
        fieldFabricante: '1e1f9b23-8f78-4e02-9afa-0cd4d0e51680',
        fieldValor: '15000',
        fieldFechaVencimiento: new Date('2023-01-01'),
        fieldCondicionesAlmacenamiento: 'Probando',
        fieldCategoria: 'ALIMENTACIÓN',
        fieldCaracteristicas: 'Probando',
        fieldDescripcion: 'Probando',
        fieldNombre: 'Arroz'
      });
      
      spyOn(service, 'postData').and.returnValue(Promise.resolve(of({ success: true })));
      
      component.onSubmit();
      tick();
      
      expect(component.isSubmitting).toBeFalse();
  
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    }));
  
    it('should handle API error', fakeAsync(() => {
      component.cargaProductoForm.patchValue({
        fieldCodigo: 'SKU-456',
        fieldFabricante: '1e1f9b23-8f78-4e02-9afa-0cd4d0e51680',
        fieldValor: '15000',
        fieldFechaVencimiento: new Date('2023-01-01'),
        fieldCondicionesAlmacenamiento: 'Probando',
        fieldCategoria: 'ALIMENTACIÓN',
        fieldCaracteristicas: 'Probando',
        fieldDescripcion: 'Probando',
        fieldNombre: 'Arroz'
      });
      
      const errorResponse = new Error('API Error');
      spyOn(service, 'postData').and.returnValue(Promise.resolve(throwError(() => errorResponse)));
      spyOn(console, 'error');
      
      component.onSubmit();
      tick();
      
      expect(console.error).toHaveBeenCalledWith('API Error:', errorResponse);
      expect(component.isSubmitting).toBeFalse();
  
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    }));
  
    it('should handle image processing error', fakeAsync(() => {
      component.cargaProductoForm.patchValue({
        fieldCodigo: 'SKU-456',
        fieldFabricante: '1e1f9b23-8f78-4e02-9afa-0cd4d0e51680',
        fieldValor: '15000',
        fieldFechaVencimiento: new Date('2023-01-01'),
        fieldCondicionesAlmacenamiento: 'Probando',
        fieldCategoria: 'ALIMENTACIÓN',
        fieldCaracteristicas: 'Probando',
        fieldDescripcion: 'Probando',
        fieldNombre: 'Arroz'
      });
      
      const error = new Error('Image processing failed');
      spyOn(service, 'postData').and.returnValue(Promise.reject(error));
      spyOn(console, 'error');
      
      component.onSubmit();
      tick();
      
      expect(console.error).toHaveBeenCalledWith('Image processing error:', error);
      expect(component.isSubmitting).toBeFalse();
  
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    }));
  
    it('should call updateProducto when in edit mode', fakeAsync(() => {
      component.isEditMode = true;
      component.idProducto = 'test-id';
      
      const mockResponse = { success: true };
      spyOn(service, 'updateProducto').and.returnValue(Promise.resolve(of(mockResponse)));
      spyOn(window, 'alert');
      
      component.onSubmit();
      tick();
      
      expect(service.updateProducto).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Producto actualizado correctamente!');
      expect(component.isSubmitting).toBeFalse();
  
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    }));
  
    it('should handle error during update in edit mode', fakeAsync(() => {
      component.isEditMode = true;
      component.idProducto = 'test-id';
      
      const errorResponse = new Error('Update failed');
      spyOn(service, 'updateProducto').and.returnValue(Promise.resolve(throwError(() => errorResponse)));
      spyOn(console, 'error');
      spyOn(window, 'alert');
      
      component.onSubmit();
      tick();
      
      expect(console.error).toHaveBeenCalledWith('API Error:', errorResponse);
      expect(window.alert).toHaveBeenCalledWith('Error al procesar la solicitud');
      expect(component.isSubmitting).toBeFalse();
  
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    }));
  
    it('should not submit when already submitting', () => {
      component.isSubmitting = true;
      
      spyOn(service, 'postData');
      spyOn(service, 'updateProducto');
      
      component.onSubmit();
      
      expect(service.postData).not.toHaveBeenCalled();
      expect(service.updateProducto).not.toHaveBeenCalled();
  
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    });
  
    it('should include idProducto in formData when in edit mode', fakeAsync(() => {
      component.isEditMode = true;
      component.idProducto = 'test-id-123';
      
      spyOn(service, 'updateProducto').and.returnValue(Promise.resolve(of({})));
      
      component.onSubmit();
      tick();
      
      expect(service.updateProducto).toHaveBeenCalledWith(jasmine.objectContaining({
        id: 'test-id-123'
      }));
  
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    }));
  
    it('should format date before submission in edit mode', fakeAsync(() => {
      component.isEditMode = true;
      component.idProducto = 'test-id';
      const testDate = new Date('2025-12-31');
      component.cargaProductoForm.patchValue({ fieldFechaVencimiento: testDate });
      
      spyOn(component, 'formatDateToISOWithTime').and.callThrough();
      spyOn(service, 'updateProducto').and.returnValue(Promise.resolve(of({})));
      
      component.onSubmit();
      tick();
      
      expect(component.formatDateToISOWithTime).toHaveBeenCalledWith(testDate);
      expect(service.updateProducto).toHaveBeenCalledWith(jasmine.objectContaining({
        fieldFechaVencimiento: '2025-12-31T00:00:00'
      }));
  
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    }));
  
    it('should handle image processing error in edit mode', fakeAsync(() => {
      component.isEditMode = true;
      component.idProducto = 'test-id';
      
      const error = new Error('Image processing failed');
      spyOn(service, 'updateProducto').and.returnValue(Promise.reject(error));
      spyOn(console, 'error');
      spyOn(window, 'alert');
      
      component.onSubmit();
      tick();
      
      expect(console.error).toHaveBeenCalledWith('Image processing error:', error);
      expect(window.alert).toHaveBeenCalledWith('Error procesando la imagen cargada');
      expect(component.isSubmitting).toBeFalse();
  
      const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
      req.flush({});
    }));
  });

});
