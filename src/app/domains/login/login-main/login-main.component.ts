import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-main',
  standalone: false,
  templateUrl: './login-main.component.html',
  styleUrls: ['./login-main.component.css']
})
export class LoginMainComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
  }

  goToRecover() {
    this.router.navigate(['/recover']);
  }

}
