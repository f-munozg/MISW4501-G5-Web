/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GestionAlertasInventarioCriticoComponent } from './gestion-alertas-inventario-critico.component';
import { InventariosModule } from '../inventarios.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GestionAlertasInventarioCriticoService } from './gestion-alertas-inventario-critico.service';

describe('GestionAlertasInventarioCriticoComponent', () => {
  let component: GestionAlertasInventarioCriticoComponent;
  let fixture: ComponentFixture<GestionAlertasInventarioCriticoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionAlertasInventarioCriticoComponent ],
      imports: [ InventariosModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [ GestionAlertasInventarioCriticoService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionAlertasInventarioCriticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
