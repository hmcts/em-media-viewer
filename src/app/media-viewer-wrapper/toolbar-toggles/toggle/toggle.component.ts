import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: '[app-toggle]',
  templateUrl: './toggle.component.html',
  styleUrls: ['../toolbar-toggles.component.scss']
})
export class ToggleComponent {
  @Input() label: string;
  @Output() toggleButtonOverrides = new EventEmitter();
}
