/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoginMainComponent } from './login-main.component';
import { MaterialModule } from 'src/app/material/material.module';
import { LoginModule } from '../login.module';

describe('LoginMainComponent', () => {
  let component: LoginMainComponent;
  let fixture: ComponentFixture<LoginMainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginMainComponent ],
      imports: [ MaterialModule, LoginModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
