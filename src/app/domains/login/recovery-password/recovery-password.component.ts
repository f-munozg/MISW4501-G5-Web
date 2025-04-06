import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery-password',
  standalone: false,
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.css']
})
export class RecoveryPasswordComponent implements OnInit {

  @Output() goToLogin = new EventEmitter<void>();

  onNavigate() {
    this.goToLogin.emit();
  }
  
  constructor() { }

  ngOnInit() {
  }

}
