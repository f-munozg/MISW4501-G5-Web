/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoginMainComponent } from './login-main.component';
import { MaterialModule } from 'src/app/material/material.module';
import { LoginModule } from '../login.module';
import { Router } from '@angular/router';

describe('LoginMainComponent', () => {
  let component: LoginMainComponent;
  let fixture: ComponentFixture<LoginMainComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginMainComponent ],
      imports: [ MaterialModule, LoginModule ],
      providers: [
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginMainComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /recover route', () => {
    component.goToRecover();
    expect(router.navigate).toHaveBeenCalledWith(['/recover']); // Este test puede cambiar cuando se mejore el routing
  });

});
