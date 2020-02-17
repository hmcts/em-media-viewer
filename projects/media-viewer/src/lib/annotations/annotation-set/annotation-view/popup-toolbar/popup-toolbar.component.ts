import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Rectangle} from '../rectangle/rectangle.model';

@Component({
  selector: 'mv-popup-toolbar',
  templateUrl: './popup-toolbar.component.html'
})
export class PopupToolbarComponent {

  readonly defaultHeight;
  readonly defaultWidth;

  @Input() rectangle: Rectangle;
  @Input() zoom = 1;
  @Input() rotate = 0;
  @Input() height: number;
  @Input() width: number;
  @Output() deleteHighlight = new EventEmitter();
  @Output() addOrEditComment = new EventEmitter();

  constructor() {
    this.defaultHeight = 70;
    this.defaultWidth = 350;
  }

  get style() {
    const style: any = {
      top: this.top + 'px',
      left: this.left + 'px'
    };
    if (this.rotate === 90) {
      style.transform = 'rotate(-90deg)';
      style['transform-origin'] = 'top left';
    } else if (this.rotate === 180) {
      style.transform = 'rotate(-180deg)';
      style['transform-origin'] = 'center center';
    } else if (this.rotate === 270) {
      style.transform = 'rotate(-270deg)';
      style['transform-origin'] = 'top left';
    }
    return style;
  }

  get top() {
    if (this.rotate === 0) {
      const top = this.rectangle.y * this.zoom - this.defaultHeight;
      return top <= 0 ? this.defaultHeight : top;

    } else if (this.rotate === 90) {
      const top = this.rectangle.y * this.zoom + this.rectangle.height / 2 * this.zoom + this.defaultWidth / 2;
      if (top >= this.height) {
        return this.height;
      } else if (top < this.defaultWidth) {
        return this.defaultWidth;
      } else {
        return top;
      }

    } else if (this.rotate === 180) {
      const top = (this.rectangle.y + this.rectangle.height) * this.zoom + 10;
      return top >= this.height - this.defaultHeight ? this.height - this.defaultHeight : top;

    } else if (this.rotate === 270) {
      const top = (this.rectangle.y + (this.rectangle.height / 2)) * this.zoom - (this.defaultWidth / 2);
      if (top <= 0) {
        return 0;
      } else if (top > this.height - this.defaultWidth) {
        return this.height - this.defaultWidth;
      } else {
        return top;
      }

    }
  }

  get left() {
    if (this.rotate === 0 || this.rotate === 180) {
      const left = (this.rectangle.x + (this.rectangle.width / 2)) * this.zoom - (this.defaultWidth / 2);
      if (left <= 0) {
        return 0;
      } else if (left >= this.width - this.defaultWidth) {
        return this.width - this.defaultWidth;
      } else {
        return left;
      }

    } else if (this.rotate === 90) {
      const left = (this.rectangle.x * this.zoom) - (this.defaultHeight);
      return left <= 0 ? this.defaultHeight : left;

    } else if (this.rotate === 270) {
      const left = (this.rectangle.x + (this.rectangle.width)) * this.zoom + this.defaultHeight;
      return left >= this.width - this.defaultHeight ? this.width - this.defaultHeight : left;

    }
  }
}
