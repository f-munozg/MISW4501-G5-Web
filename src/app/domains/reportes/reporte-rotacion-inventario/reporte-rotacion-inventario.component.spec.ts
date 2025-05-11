/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReporteRotacionInventarioComponent } from './reporte-rotacion-inventario.component';
import { ReportesModule } from '../reportes.module';

describe('ReporteRotacionInventarioComponent', () => {
  let component: ReporteRotacionInventarioComponent;
  let fixture: ComponentFixture<ReporteRotacionInventarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteRotacionInventarioComponent ],
      imports: [ ReportesModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteRotacionInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
