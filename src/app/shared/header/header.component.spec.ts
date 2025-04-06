/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, EventEmitter } from '@angular/core';

import { HeaderComponent } from './header.component';
import { MaterialModule } from '../../material/material.module';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ HeaderComponent, MaterialModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow to open dropdown for internationalization', () => {
    const selectSpy = spyOn(component, 'selectLanguage').and.callThrough();

    const menuTrigger = fixture.debugElement.query(By.css('.internationalizationBtn'));
    if (!menuTrigger?.nativeElement) {
      fail('Menu trigger button not found');
      return;
    }
    menuTrigger.nativeElement.click();
    fixture.detectChanges();

    const menuPanel = document.querySelector('.languageMenu');
    if (!(menuPanel instanceof HTMLElement)) {
      fail('Menu panel failed to open');
      return;
    }

    const firstMenuItem = menuPanel.querySelector('.enOption');
    if (!(firstMenuItem instanceof HTMLElement)) {
      fail('Menu items not found');
      return;
    }
    
    firstMenuItem.click();
    fixture.detectChanges();

    expect(selectSpy).toHaveBeenCalledWith('en');
  });

  it('should set isMenuOpen to true when onMenuOpened is called', () => {
    component.isMenuOpen = false;
    component.onMenuOpened();
    expect(component.isMenuOpen).toBeTrue();
  });

  it('should set isMenuOpen to false when onMenuClosed is called', () => {
    component.isMenuOpen = true;
    component.onMenuClosed();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should emit when the menu button is clicked', () => {
    spyOn(component.toggleSidenav, 'emit');
    
    const button = fixture.debugElement.query(By.css('.sidenavBtn'));
    button.triggerEventHandler('click', null);
    
    expect(component.toggleSidenav.emit).toHaveBeenCalled();
  });

  it('should emit when toggleSidenav is called directly', () => {
    spyOn(component.toggleSidenav, 'emit');
    
    component.toggleSidenav.emit();
    
    expect(component.toggleSidenav.emit).toHaveBeenCalled();
  });

});
