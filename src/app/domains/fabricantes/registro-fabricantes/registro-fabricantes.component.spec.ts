/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { RegistroFabricantesService } from './registro-fabricantes.service';
import { RegistroFabricantesComponent } from './registro-fabricantes.component';
import { FabricantesModule } from '../fabricantes.module';

describe('RegistroFabricantesComponent', () => {
  let component: RegistroFabricantesComponent;
  let fixture: ComponentFixture<RegistroFabricantesComponent>;
  let service: RegistroFabricantesService;
  let httpMock: HttpTestingController;
  let apiUrl = 'http://localhost:5003/providers/add';

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroFabricantesComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, FabricantesModule],
      providers: [RegistroFabricantesService]
    }).compileComponents();

    service = TestBed.inject(RegistroFabricantesService);
    httpMock = TestBed.inject(HttpTestingController);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroFabricantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Verify no unmatched requests are outstanding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear the form fields when using the clearAll function', () => {
    component.registroFabricantesForm.patchValue({
      fieldNit: '1234',
      fieldNombre: 'TestFabrica',
      fieldPais: 'Colombia',
      fieldDireccion: 'Avenida Falsa 123',
      fieldIdentificacion: '5678',
      fieldNombreContacto: 'TestFabricante',
      fieldTelefono: '1234567890',
      fieldDireccionContacto: 'Avenida Falsa 456' 
    });

    component.clearAll()

    expect(component.registroFabricantesForm.value).toEqual({
      fieldNit: null,
      fieldNombre: null,
      fieldPais: null,
      fieldDireccion: null,
      fieldIdentificacion: null,
      fieldNombreContacto: null,
      fieldTelefono: null,
      fieldDireccionContacto: null
    })
  });

  it('should clear the form when the Cancel button is clicked', () => {
    component.registroFabricantesForm.patchValue({
      fieldNit: '1234',
      fieldNombre: 'TestFabrica',
      fieldPais: 'Colombia',
      fieldDireccion: 'Avenida Falsa 123',
      fieldIdentificacion: '5678',
      fieldNombreContacto: 'TestFabricante',
      fieldTelefono: '1234567890',
      fieldDireccionContacto: 'Avenida Falsa 456' 
    });

    const cancelButton = fixture.nativeElement.querySelector('.CancelarBtn');
    cancelButton.click();
    fixture.detectChanges();

    expect(component.registroFabricantesForm.value).toEqual({
      fieldNit: null,
      fieldNombre: null,
      fieldPais: null,
      fieldDireccion: null,
      fieldIdentificacion: null,
      fieldNombreContacto: null,
      fieldTelefono: null,
      fieldDireccionContacto: null
    })
  });

  it('should send a POST request with the form data', () => {
    const mockFormData = {
      fieldNit: '1234',
      fieldNombre: 'TestFabrica',
      fieldDireccion: 'Avenida Falsa 123',
      fieldPais: 'Colombia',
      fieldIdentificacion: '5678',
      fieldNombreContacto: 'TestFabricante',
      fieldTelefono: '1234567890',
      fieldDireccionContacto: 'Avenida Falsa 456'
    };

    const requestData = {
      identification_number: '1234',
      name: 'TestFabrica',
      address: 'Avenida Falsa 123',
      countries: ['Colombia'],
      identification_number_contact: '5678',
      name_contact: 'TestFabricante',
      phone_contact: '1234567890',
      address_contact: 'Avenida Falsa 456'
    };

    service.postData(mockFormData).subscribe();

    const req = httpMock.expectOne(apiUrl);

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual(requestData); 

    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush({ success: true });
    });

  it('should call postData() when Save button is clicked', () => {
    spyOn(service, 'postData').and.callThrough();

    component.registroFabricantesForm.setValue({
      fieldNit: '1234',
      fieldNombre: 'TestFabrica',
      fieldDireccion: 'Avenida Falsa 123',
      fieldPais: 'Colombia',
      fieldIdentificacion: '5678',
      fieldNombreContacto: 'TestFabricante',
      fieldTelefono: '1234567890',
      fieldDireccionContacto: 'Avenida Falsa 456'
    });

    const saveButton = fixture.nativeElement.querySelector('.GuardarBtn');
    saveButton.click();

    expect(service.postData).toHaveBeenCalledWith(component.registroFabricantesForm.value);

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      identification_number: '1234',
      name: 'TestFabrica',
      address: 'Avenida Falsa 123',
      countries: ['Colombia'],
      identification_number_contact: '5678',
      name_contact: 'TestFabricante',
      phone_contact: '1234567890',
      address_contact: 'Avenida Falsa 456'
    });
    req.flush({ success: true });
  });
  
  it('should handle failed POST request', (done) => {
    component.registroFabricantesForm.patchValue({
      fieldNit: '1234',
      fieldNombre: 'TestFabrica',
      fieldPais: 'Colombia',
      fieldDireccion: 'Avenida Falsa 123',
      fieldIdentificacion: '5678',
      fieldNombreContacto: 'TestFabricante',
      fieldTelefono: '1234567890',
      fieldDireccionContacto: 'Avenida Falsa 456' 
    });
    fixture.detectChanges();
  
    const errorSpy = spyOn(console, 'error'); 
  
    component.onSubmit();
  
    const req = httpMock.expectOne(apiUrl);
    req.flush({}, { status: 400, statusText: 'Error!' });
  
    setTimeout(() => {
      expect(errorSpy).toHaveBeenCalled();
      done();
    });
  });

});
