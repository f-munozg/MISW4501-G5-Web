import { Component, OnInit } from '@angular/core';
import { AccessibilityBarComponent } from '../accessibility-bar/accessibility-bar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-test-container',
  templateUrl: './test-container.component.html',
  styleUrls: ['./test-container.component.css'],
  imports: [AccessibilityBarComponent, HeaderComponent] 
})
export class TestContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
