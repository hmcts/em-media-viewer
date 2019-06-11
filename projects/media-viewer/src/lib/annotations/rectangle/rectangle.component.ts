import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Rectangle } from './rectangle.model';

@Component({
  selector: 'mv-anno-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent {

  @Input() selected: boolean;
  @Input() rectangle: Rectangle;
  @Input() color: String;

  @Output() click = new EventEmitter();
  @Output() loseFocus = new EventEmitter();

  onClick() {
    this.click.emit();
  }

  onLoseFocus() {
    this.loseFocus.emit();
  }

}
