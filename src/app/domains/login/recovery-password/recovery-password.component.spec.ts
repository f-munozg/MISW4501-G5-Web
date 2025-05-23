/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecoveryPasswordComponent } from './recovery-password.component';
import { MaterialModule } from 'src/app/material/material.module';
import { LoginModule } from '../login.module';

describe('RecoveryPasswordComponent', () => {
  let component: RecoveryPasswordComponent;
  let fixture: ComponentFixture<RecoveryPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryPasswordComponent ],
      imports: [ MaterialModule, LoginModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onNavigate() when button is clicked', () => {
    spyOn(component, 'onNavigate');
    const button = fixture.debugElement.query(By.css('.confirmNewPasswordBtn'));
    button.nativeElement.click();
    
    expect(component.onNavigate).toHaveBeenCalled();
  });

  it('should emit goToLogin event when onNavigate is called', () => {
    spyOn(component.goToLogin, 'emit');
    component.onNavigate();
    
    expect(component.goToLogin.emit).toHaveBeenCalled();
  });
});
