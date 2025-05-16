/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GestionAlertasInventarioCriticoComponent } from './gestion-alertas-inventario-critico.component';

describe('GestionAlertasInventarioCriticoComponent', () => {
  let component: GestionAlertasInventarioCriticoComponent;
  let fixture: ComponentFixture<GestionAlertasInventarioCriticoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionAlertasInventarioCriticoComponent ]
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
