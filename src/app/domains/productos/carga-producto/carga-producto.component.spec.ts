import { TestBed, waitForAsync, inject, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { CargaProductoService } from './carga-producto.service';
import { CargaProductoComponent } from './carga-producto.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { ProductosModule } from '../productos.module';

describe('CargaProductoComponent', () => {
  let component: CargaProductoComponent;
  let fixture: ComponentFixture<CargaProductoComponent>;
  let service: CargaProductoService;
  let httpMock: HttpTestingController;
  let apiUrl = 'http://localhost:5003/products/add';

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

    const req = httpMock.expectOne('http://localhost:5003/providers');
    req.flush({});
  });

  it('should clear the form fields when using the clearAll function', () => {
    component.cargaProductoForm.patchValue({
      fieldCodigo: 'SKU-456',
      fieldFabricante: '1e1f9b23-8f78-4e02-9afa-0cd4d0e51680',
      fieldValor: '15000',
      fieldFechaVencimiento: '4/2/2025',
      fieldCondicionesAlmacenamiento: 'Probando',
      fieldCategoria: 'ALIMENTACIÓN',
      fieldCaracteristicas: 'Probando',
      fieldDescripcion: 'Probando',
      fieldNombre: 'Arroz'
    });

    component.clearAll()

    expect(component.cargaProductoForm.value).toEqual({
      fieldCodigo: null,
      fieldFabricante: null,
      fieldValor: null,
      fieldFechaVencimiento: null,
      fieldCondicionesAlmacenamiento: null,
      fieldCategoria: null,
      fieldCaracteristicas: null,
      fieldDescripcion: null,
      fieldNombre: null,
    })

    const req = httpMock.expectOne('http://localhost:5003/providers');
    req.flush({});
  });

  it('should clear the form when the Cancel button is clicked', () => {
    component.cargaProductoForm.patchValue({
      fieldCodigo: 'SKU-456',
      fieldFabricante: '1e1f9b23-8f78-4e02-9afa-0cd4d0e51680',
      fieldValor: '15000',
      fieldFechaVencimiento: '4/2/2025',
      fieldCondicionesAlmacenamiento: 'Probando',
      fieldCategoria: 'ALIMENTACIÓN',
      fieldCaracteristicas: 'Probando',
      fieldDescripcion: 'Probando',
      fieldNombre: 'Arroz'
    });

    const cancelButton = fixture.nativeElement.querySelector('.CancelarBtn');
    cancelButton.click();
    fixture.detectChanges();

    expect(component.cargaProductoForm.value).toEqual({
      fieldCodigo: null,
      fieldFabricante: null,
      fieldValor: null,
      fieldFechaVencimiento: null,
      fieldCondicionesAlmacenamiento: null,
      fieldCategoria: null,
      fieldCaracteristicas: null,
      fieldDescripcion: null,
      fieldNombre: null,
    });

    const req = httpMock.expectOne('http://localhost:5003/providers');
    req.flush({});
  });

  it('should handle file selection', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;
    
    component.onFileSelected(event);
    expect(component.selectedFile).toBe(file);

    const req = httpMock.expectOne('http://localhost:5003/providers');
    req.flush({});
  });

  it('should not set file when no files are selected', () => {
    const event = { target: { files: [] } } as unknown as Event;
    component.onFileSelected(event);
    expect(component.selectedFile).toBeNull();

    const req = httpMock.expectOne('http://localhost:5003/providers');
    req.flush({});
  });

  it('should not submit when form is invalid', () => {
    spyOn(service, 'postData');
    component.onSubmit();
    expect(service.postData).not.toHaveBeenCalled();
    expect(component.isSubmitting).toBeFalse();

    const req = httpMock.expectOne('http://localhost:5003/providers');
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

    const req = httpMock.expectOne('http://localhost:5003/providers');
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

    const req = httpMock.expectOne('http://localhost:5003/providers');
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

    const req = httpMock.expectOne('http://localhost:5003/providers');
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

    const req = httpMock.expectOne('http://localhost:5003/providers');
    req.flush({});
  }));

  it('should format Date object correctly', () => {
    const testDate = new Date(2025, 3, 6); // Abril 6, 2025
    const result = component.formatDateToISOWithTime(testDate);
    expect(result).toBe('2025-04-06T00:00:00');

    const req = httpMock.expectOne('http://localhost:5003/providers');
    req.flush({});
  });

  it('should format date string correctly', () => {
    const dateString = '2025-04-06';
    const result = component.formatDateToISOWithTime(dateString);
    expect(result).toBe('2025-04-06T00:00:00');
  
    const req = httpMock.expectOne('http://localhost:5003/providers');
    req.flush({});
  });

  it('should handle single-digit months and days', () => {
    const testDate = new Date(2025, 0, 1); // Enero 1, 2025
    const result = component.formatDateToISOWithTime(testDate);
    expect(result).toBe('2025-01-01T00:00:00');
  
    const req = httpMock.expectOne('http://localhost:5003/providers');
    req.flush({});
  });

  it('should pad hours, minutes and seconds with zeros', () => {
    const testDate = new Date(2025, 5, 15);
    const result = component.formatDateToISOWithTime(testDate);
    expect(result.endsWith('T00:00:00')).toBeTrue();
  
    const req = httpMock.expectOne('http://localhost:5003/providers');
    req.flush({});
  });

  it('should convert string to Date object', () => {
    const dateString = 'April 6, 2025';
    const result = component.formatDateToISOWithTime(dateString);
    expect(result).toBe('2025-04-06T00:00:00');
  
    const req = httpMock.expectOne('http://localhost:5003/providers');
    req.flush({});
  });

  it('should handle ISO string input', () => {
    const isoString = '2025-04-06T14:30:00Z';
    const result = component.formatDateToISOWithTime(isoString);
    expect(result).toBe('2025-04-06T00:00:00');
  
    const req = httpMock.expectOne('http://localhost:5003/providers');
    req.flush({});
  });

  it('should throw error for invalid date string', () => {
    expect(() => component.formatDateToISOWithTime('invalid-date')).toThrow();
  
    const req = httpMock.expectOne('http://localhost:5003/providers');
    req.flush({});
  });


});
