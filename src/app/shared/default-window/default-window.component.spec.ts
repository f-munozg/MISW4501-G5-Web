/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DefaultWindowComponent } from './default-window.component';
import { MaterialModule } from 'src/app/material/material.module';

describe('DefaultWindowComponent', () => {
  let component: DefaultWindowComponent;
  let fixture: ComponentFixture<DefaultWindowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ DefaultWindowComponent, MaterialModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with sidenav closed', () => {
    expect(component.sidenavOpen).toBeFalse();
  });

  it('should toggle sidenav state when toggleSidenav is called', () => {
    // Al lanzarse el componente
    expect(component.sidenavOpen).toBeFalse();
    
    // Se presiona el botón de menú una vez para abrir
    component.toggleSidenav();
    expect(component.sidenavOpen).toBeTrue();
    
    // Se presiona el botón de menú por segunda vez para cerrar
    component.toggleSidenav();
    expect(component.sidenavOpen).toBeFalse();
  });
});
