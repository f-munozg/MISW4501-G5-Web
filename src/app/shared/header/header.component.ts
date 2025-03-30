import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [ MaterialModule ]
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidenav = new EventEmitter<void>();

  selectLanguage(lang: string) {
    console.log('Selected language:', lang);
    // Falta agregar la lógica de internacionalización aqui.
  }

  isMenuOpen = false;

  onMenuOpened() {
    this.isMenuOpen = true;
  }

  onMenuClosed() {
    this.isMenuOpen = false;
  }

  constructor() { }

  ngOnInit() {
  }


}
