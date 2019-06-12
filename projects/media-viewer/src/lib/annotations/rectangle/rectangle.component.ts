import { Component, Input } from '@angular/core';
import { Rectangle } from './rectangle.model';

@Component({
  selector: 'mv-anno-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent {

  selected = false;
  @Input() rectangle: Rectangle;
  @Input() color: String;

  onMouseDown() {
    this.selected = true;
  }

  onMouseUp() {
    this.selected = false;
  }
}
