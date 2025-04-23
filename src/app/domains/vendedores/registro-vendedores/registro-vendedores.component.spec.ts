/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RegistroVendedoresComponent } from './registro-vendedores.component';
import { VendedoresModule } from '../vendedores.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('RegistroVendedoresComponent', () => {
  let component: RegistroVendedoresComponent;
  let fixture: ComponentFixture<RegistroVendedoresComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroVendedoresComponent ],
      imports: [ VendedoresModule, HttpClientTestingModule, ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroVendedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('UI behavior', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  
    /*
    it('should initialize form with all fields but numeroIdentificacion as disabled', () => {
      expect(component.registroVendedoresForm.get('fieldNombre')?.disabled).toBe(true);
      expect(component.registroVendedoresForm.get('fieldCorreoElectronico')?.disabled).toBe(true);
      expect(component.registroVendedoresForm.get('fieldDireccion')?.disabled).toBe(true);
      expect(component.registroVendedoresForm.get('fieldTelefono')?.disabled).toBe(true);
      expect(component.registroVendedoresForm.get('fieldZona')?.disabled).toBe(true);
      expect(component.registroVendedoresForm.get('fieldNumeroIdentificacion')?.enabled).toBe(true);
    });

    it('should render numeroIdentificacion dropdown', () => {
      const numeroIdentificacionField = fixture.nativeElement.querySelector('mat-select[formControlName="fieldNumeroIdentificacion"]');
      expect(numeroIdentificacionField).toBeTruthy();
    });
  
    it('should show disabled fields as non-interactive', () => {
      const fieldNombreInput = fixture.nativeElement.querySelector('input[formControlName="fieldNombre"]');
      expect(fieldNombreInput.disabled).toBe(true);
      
      const fieldCorreoElectronicoInput = fixture.nativeElement.querySelector('input[formControlName="fieldCorreoElectronico"]');
      expect(fieldCorreoElectronicoInput.disabled).toBe(true);
  
      const fieldDireccionInput = fixture.nativeElement.querySelector('input[formControlName="fieldDireccion"]');
      expect(fieldDireccionInput.disabled).toBe(true);
  
      const fieldTelefonoInput = fixture.nativeElement.querySelector('input[formControlName="fieldTelefono"]');
      expect(fieldTelefonoInput.disabled).toBe(true);
  
      const fieldZonaInput = fixture.debugElement.query(By.css('mat-select[formControlName="fieldZona"]'));
      expect(fieldZonaInput.nativeElement.getAttribute('aria-disabled')).toBe('true');
    });
    */
  
    it('should mark form as invalid when required fields are empty', () => {
      if (component.registroVendedoresForm.get('fieldNumeroIdentificacion')?.validator) {
        component.registroVendedoresForm.get('fieldNumeroIdentificacion')?.setValue('');
        expect(component.registroVendedoresForm.valid).toBeFalse();
      }
    });
  })

});
