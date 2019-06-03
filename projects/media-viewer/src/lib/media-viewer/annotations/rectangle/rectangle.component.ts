import { Component } from '@angular/core';

@Component({
  selector: 'mv-anno-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent {

  selected = false;

  onMouseDown() {
    console.log('selected');
    this.selected = true;
  }

  onMouseUp() {
    console.log('unselected');
    this.selected = false;
  }
}
