import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recovery-user',
  standalone: false,
  templateUrl: './recovery-user.component.html',
  styleUrls: ['./recovery-user.component.css']
})
export class RecoveryUserComponent implements OnInit {

  @Output() openModal = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

}
