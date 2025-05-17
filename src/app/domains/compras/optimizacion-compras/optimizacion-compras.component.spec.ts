/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OptimizacionComprasComponent } from './optimizacion-compras.component';
import { ComprasModule } from '../compras.module';

describe('OptimizacionComprasComponent', () => {
  let component: OptimizacionComprasComponent;
  let fixture: ComponentFixture<OptimizacionComprasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizacionComprasComponent ],
      imports: [ ComprasModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizacionComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
