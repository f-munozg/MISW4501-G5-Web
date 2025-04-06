/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { RecoveryContainerComponent } from './recovery-container.component';
import { MaterialModule } from 'src/app/material/material.module';
import { LoginModule } from '../login.module';

@Component({
  selector: 'app-recovery-user',
})
class MockRecoveryUserComponent {
  @Output() openModal = new EventEmitter<void>();
}

@Component({
  selector: 'app-recovery-modal',
})
class MockRecoveryModalComponent {
  @Output() close = new EventEmitter<void>();
}

@Component({
  selector: 'app-recovery-password',
})
class MockRecoveryPasswordComponent {
  @Output() goToLogin = new EventEmitter<void>();
}

describe('RecoveryContainerComponent', () => {
  let component: RecoveryContainerComponent;
  let fixture: ComponentFixture<RecoveryContainerComponent>;
  let router: Router

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryContainerComponent ],
      imports: [ MaterialModule, LoginModule, MockRecoveryUserComponent, MockRecoveryModalComponent, MockRecoveryPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryContainerComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with recovery-user view', () => {
    expect(component.currentView).toBe('recovery-user');
  });

  describe('view switching', () => {
    it('should switch to recovery-modal when showModal is called', () => {
      component.showModal();
      expect(component.currentView).toBe('recovery-modal');
    });

    it('should switch to recovery-password when closeModal is called', () => {
      component.closeModal();
      expect(component.currentView).toBe('recovery-password');
    });

    it('should navigate to login when goToLogin is called', () => {
      spyOn(router, 'navigate');
      component.goToLogin();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('child component interactions', () => {
    it('should handle openModal event from recovery-user', () => {
      const recoveryUser = fixture.debugElement.nativeElement.querySelector('app-recovery-user');
      const button = recoveryUser.querySelector('button');
      button.click();
      expect(component.currentView).toBe('recovery-modal');
    });

    it('should handle close event from recovery-modal', () => {
      component.currentView = 'recovery-modal';
      fixture.detectChanges();
      
      const recoveryModal = fixture.debugElement.nativeElement.querySelector('app-recovery-modal');
      const button = recoveryModal.querySelector('button');
      button.click();
      expect(component.currentView).toBe('recovery-password');
    });

    it('should handle goToLogin event from recovery-password', () => {
      spyOn(router, 'navigate');
      component.currentView = 'recovery-password';
      fixture.detectChanges();
      
      const recoveryPassword = fixture.debugElement.nativeElement.querySelector('app-recovery-password');
      const button = recoveryPassword.querySelector('button');
      button.click();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('template rendering', () => {
    it('should render recovery-user by default', () => {
      const recoveryUser = fixture.debugElement.nativeElement.querySelector('app-recovery-user');
      expect(recoveryUser).toBeTruthy();
    });

    it('should render recovery-modal when currentView is recovery-modal', () => {
      component.currentView = 'recovery-modal';
      fixture.detectChanges();
      const recoveryModal = fixture.debugElement.nativeElement.querySelector('app-recovery-modal');
      expect(recoveryModal).toBeTruthy();
    });

    it('should render recovery-password when currentView is recovery-password', () => {
      component.currentView = 'recovery-password';
      fixture.detectChanges();
      const recoveryPassword = fixture.debugElement.nativeElement.querySelector('app-recovery-password');
      expect(recoveryPassword).toBeTruthy();
    });
  });

});
