import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery-container',
  standalone: false,
  templateUrl: './recovery-container.component.html',
  styleUrls: ['./recovery-container.component.css']
})
export class RecoveryContainerComponent implements OnInit {
  currentView: 'recovery-user' | 'recovery-modal' | 'recovery-password' = 'recovery-user';

  constructor(private router: Router) {}

  showModal() {
    this.currentView = 'recovery-modal';
  }

  closeModal() {
    this.currentView = 'recovery-password';
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {
  }

}
