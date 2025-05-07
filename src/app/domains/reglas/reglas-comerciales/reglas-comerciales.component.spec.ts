/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReglasComercialesComponent } from './reglas-comerciales.component';
import { ReglasModule } from '../reglas.module';

describe('ReglasComercialesComponent', () => {
  let component: ReglasComercialesComponent;
  let fixture: ComponentFixture<ReglasComercialesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglasComercialesComponent ],
      imports: [ ReglasModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglasComercialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
