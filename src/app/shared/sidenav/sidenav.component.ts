import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  imports: [MaterialModule]
})
export class SidenavComponent implements OnInit {

  @Input() isOpen = false;
    
  constructor() { }

  ngOnInit() {
  }

}
