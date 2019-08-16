import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Rectangle} from '../rectangle/rectangle.model';

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
  @Input() height: number;
  @Input() width: number;
  @Output() deleteHighlight = new EventEmitter();
  @Output() addOrEditComment = new EventEmitter();

  popupStyles() {
    if (this.rotate === 0) {
      const top = this.rectangle.y * this.zoom - this.HEIGHT;
      const left = ((this.rectangle.x + (this.rectangle.width / 2)) * this.zoom - (this.WIDTH / 2));
      return {
        top: (top <= 0 ? this.HEIGHT : top) + 'px',
        left: (left <= 0 ? 0 : left) + 'px'
      };
    } else if (this.rotate === 90) {
      const top = this.rectangle.y * this.zoom + this.rectangle.height / 2 * this.zoom + this.WIDTH / 2;
      const left = (this.rectangle.x * this.zoom) - (this.HEIGHT);
      return {
        transform: 'rotate(-90deg)',
        'transform-origin': 'top left',
        top: (top >= this.height ? this.height : top) + 'px',
        left: (left <= 0 ? this.HEIGHT : left) + 'px'
      };
    } else if (this.rotate === 180) {
      const top = (this.rectangle.y + this.rectangle.height) * this.zoom + 10;
      const left = ((this.rectangle.x + (this.rectangle.width / 2)) * this.zoom - (this.WIDTH / 2));
      return {
        transform: 'rotate(-180deg)',
        'transform-origin': 'center center',
        top: (top >= this.height - this.HEIGHT ? this.height - this.HEIGHT : top)  + 'px',
        left: (left >= this.width - this.WIDTH ? this.width - this.WIDTH : left) + 'px'
      };
    } else if (this.rotate === 270) {
      const top = (this.rectangle.y + (this.rectangle.height / 2)) * this.zoom - (this.WIDTH / 2);
      const left = (this.rectangle.x + (this.rectangle.width)) * this.zoom + this.HEIGHT;
      return {
        transform: 'rotate(-270deg)',
        'transform-origin': 'top left',
        top: (top <= 0 ? 0 : top) + 'px',
        left: (left >= this.width - this.HEIGHT ? this.width - this.HEIGHT : left) + 'px'
      };
    }
  }
}
