/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecoveryUserComponent } from './recovery-user.component';
import { MaterialModule } from 'src/app/material/material.module';
import { LoginModule } from '../login.module';

describe('RecoveryUserComponent', () => {
  let component: RecoveryUserComponent;
  let fixture: ComponentFixture<RecoveryUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryUserComponent ],
      imports: [ MaterialModule, LoginModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
