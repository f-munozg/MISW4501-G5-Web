/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CargaProductoComponent } from './carga-producto.component';
import { ProductosModule } from '../productos.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('CargaProductoComponent', () => {
  let component: CargaProductoComponent;
  let fixture: ComponentFixture<CargaProductoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CargaProductoComponent ],
      imports: [ ProductosModule, HttpClientTestingModule, ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
