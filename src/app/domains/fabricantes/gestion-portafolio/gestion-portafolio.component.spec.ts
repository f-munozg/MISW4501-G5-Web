/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GestionPortafolioComponent } from './gestion-portafolio.component';
import { GestionPortafolioService } from './gestion-portafolio.service';
import { FabricantesModule } from '../fabricantes.module';

describe('GestionPortafolioComponent', () => {
  let component: GestionPortafolioComponent;
  let fixture: ComponentFixture<GestionPortafolioComponent>;
  let service: GestionPortafolioService;
  let httpMock: HttpTestingController;

  let apiUrlSellers = environment.apiUrlSellers + `/sellers`;
  let apiUrlProducts = environment.apiUrlProducts + `/products`;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionPortafolioComponent ],
      imports: [
        FabricantesModule,
        HttpClientTestingModule,
      ],
      providers:[
        GestionPortafolioService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPortafolioComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(GestionPortafolioService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const req = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
    req.flush({});
  });
});
