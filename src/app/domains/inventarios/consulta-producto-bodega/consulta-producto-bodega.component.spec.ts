/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConsultaProductoBodegaComponent } from './consulta-producto-bodega.component';
import { InventariosModule } from '../inventarios.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ConsultaProductoBodegaComponent', () => {
  let component: ConsultaProductoBodegaComponent;
  let fixture: ComponentFixture<ConsultaProductoBodegaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaProductoBodegaComponent ],
      imports: [InventariosModule, ReactiveFormsModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaProductoBodegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
