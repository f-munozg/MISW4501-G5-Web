/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReglasLegalesComponent } from './reglas-legales.component';
import { ReglasModule } from '../reglas.module';

describe('ReglasLegalesComponent', () => {
  let component: ReglasLegalesComponent;
  let fixture: ComponentFixture<ReglasLegalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglasLegalesComponent ],
      imports: [ ReglasModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglasLegalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
