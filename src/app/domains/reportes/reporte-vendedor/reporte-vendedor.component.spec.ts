/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReporteVendedorComponent } from './reporte-vendedor.component';
import { ReportesModule } from '../reportes.module';

describe('ReporteVendedorComponent', () => {
  let component: ReporteVendedorComponent;
  let fixture: ComponentFixture<ReporteVendedorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteVendedorComponent ],
      imports: [ ReportesModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
