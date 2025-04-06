import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recovery-modal',
  standalone: false,
  templateUrl: './recovery-modal.component.html',
  styleUrls: ['./recovery-modal.component.css']
})
export class RecoveryModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

}
