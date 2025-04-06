import { Component, OnInit } from '@angular/core';
import { AccessibilityBarComponent } from '../accessibility-bar/accessibility-bar.component';
import { HeaderComponent } from '../header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-default-window',
  templateUrl: './default-window.component.html',
  styleUrls: ['./default-window.component.css'],
  imports: [AccessibilityBarComponent, HeaderComponent, SidenavComponent] 
})
export class DefaultWindowComponent implements OnInit {

  sidenavOpen = false;

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
  }

  constructor() { }

  ngOnInit() {
  }

}
