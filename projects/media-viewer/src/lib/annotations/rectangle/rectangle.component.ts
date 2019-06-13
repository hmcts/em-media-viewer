import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() zoom: number;

  @Output() click = new EventEmitter();

  onClick() {
    this.click.emit();
  }

}
