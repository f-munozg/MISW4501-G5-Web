/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecoveryContainerComponent } from './recovery-container.component';
import { MaterialModule } from 'src/app/material/material.module';
import { LoginModule } from '../login.module';

describe('RecoveryContainerComponent', () => {
  let component: RecoveryContainerComponent;
  let fixture: ComponentFixture<RecoveryContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryContainerComponent ],
      imports: [ MaterialModule, LoginModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
