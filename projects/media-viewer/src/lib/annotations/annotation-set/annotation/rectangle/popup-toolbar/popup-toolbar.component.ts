import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Rectangle} from '../rectangle.model';

@Component({
  selector: 'mv-popup-toolbar',
  templateUrl: './popup-toolbar.component.html',
  styleUrls: ['./popup-toolbar.component.scss']
})
export class PopupToolbarComponent {

  readonly HEIGHT = 70;
  readonly WIDTH = 350;

  @Input() rectangle: Rectangle;
  @Input() zoom = 1;
  @Input() rotate = 0;
  @Output() deleteHighlight = new EventEmitter();


  popupStyles() {
    if (this.rotate === 0) {
      return {
        top: this.rectangle.y * this.zoom - this.HEIGHT + 'px',
        left: ((this.rectangle.x + (this.rectangle.width / 2)) * this.zoom - (this.WIDTH / 2)) + 'px'
      };
    } else if (this.rotate === 90) {
      return {
        transform: 'rotate(-90deg)',
        'transform-origin': 'top left',
        top: this.rectangle.y * this.zoom + this.rectangle.height / 2 * this.zoom + this.WIDTH / 2 + 'px',
        left: (this.rectangle.x * this.zoom) - (this.HEIGHT) + 'px'
      };
    } else if (this.rotate === 180) {
      return {
        transform: 'rotate(-180deg)',
        'transform-origin': 'center center',
        top: (this.rectangle.y + this.rectangle.height) * this.zoom + 10  + 'px',
        left: ((this.rectangle.x + (this.rectangle.width / 2)) * this.zoom - (this.WIDTH / 2)) + 'px'
      };
    } else if (this.rotate === 270) {
      return {
        transform: 'rotate(-270deg)',
        'transform-origin': 'top left',
        top: (this.rectangle.y + (this.rectangle.height / 2)) * this.zoom - (this.WIDTH / 2) + 'px',
        left: (this.rectangle.x + (this.rectangle.width)) * this.zoom + this.HEIGHT + 'px'
      };
    }
  }

}
