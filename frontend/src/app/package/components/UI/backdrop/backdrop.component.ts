import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss'],
})
export class BackdropComponent implements OnInit {
  @Output() clicked = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
