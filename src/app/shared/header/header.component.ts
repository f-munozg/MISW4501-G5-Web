import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [ MaterialModule ]
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }


}
