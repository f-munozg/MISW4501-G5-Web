/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConsultaProductoBodegaComponent } from './consulta-producto-bodega.component';
import { InventariosModule } from '../inventarios.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConsultaProductoBodegaService } from './consulta-producto-bodega.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConsultaProductoBodegaComponent', () => {
  let component: ConsultaProductoBodegaComponent;
  let fixture: ComponentFixture<ConsultaProductoBodegaComponent>;
  let service: ConsultaProductoBodegaService;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaProductoBodegaComponent ],
      imports: [InventariosModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [ConsultaProductoBodegaService]
    })
    .compileComponents();

    service = TestBed.inject(ConsultaProductoBodegaService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaProductoBodegaComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ConsultaProductoBodegaService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

/*
  afterEach(() => {
    httpMock.verify(); 
  });
*/

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
