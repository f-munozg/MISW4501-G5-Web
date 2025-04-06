/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AccessibilityBarComponent } from './accessibility-bar.component';
import { MaterialModule } from 'src/app/material/material.module';

describe('AccessibilityBarComponent', () => {
  let component: AccessibilityBarComponent;
  let fixture: ComponentFixture<AccessibilityBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ AccessibilityBarComponent, MaterialModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
