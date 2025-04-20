/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CargaMasivaProductosComponent } from './carga-masiva-productos.component';
import { CargaMasivaProductosService } from './carga-masiva-productos.service';
import { environment } from '../../../../environments/environment'
import { ReactiveFormsModule } from '@angular/forms';
import { ProductosModule } from '../productos.module';

describe('CargaMasivaProductosComponent', () => {
  let component: CargaMasivaProductosComponent;
  let fixture: ComponentFixture<CargaMasivaProductosComponent>;
  let service: CargaMasivaProductosService;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CargaMasivaProductosComponent ],
      imports: [ReactiveFormsModule, HttpClientTestingModule, ProductosModule],
      providers: [ CargaMasivaProductosService ]
    })
    .compileComponents();

    service = TestBed.inject(CargaMasivaProductosService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaMasivaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const req = httpMock.expectOne(environment.apiUrlProviders + `/providers`);
    req.flush({});
  });
});
