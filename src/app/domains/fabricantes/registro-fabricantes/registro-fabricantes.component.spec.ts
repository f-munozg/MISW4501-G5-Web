/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RegistroFabricantesService } from './registro-fabricantes.service';
import { RegistroFabricantesComponent } from './registro-fabricantes.component';
import { FabricantesModule } from '../fabricantes.module';

describe('RegistroFabricantesComponent', () => {
  let component: RegistroFabricantesComponent;
  let fixture: ComponentFixture<RegistroFabricantesComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroFabricantesComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, FabricantesModule],
      providers: [RegistroFabricantesService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroFabricantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  

});
