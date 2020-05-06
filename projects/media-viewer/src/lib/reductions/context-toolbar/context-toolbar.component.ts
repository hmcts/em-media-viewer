import { Component, EventEmitter, Input, Output } from '@angular/core';
import {Rectangle} from '../../annotations/annotation-set/annotation-view/rectangle/rectangle.model';

@Component({
  selector: 'mv-redaction-ctx-toolbar',
  templateUrl: './context-toolbar.component.html'
})
export class ContextToolbarComponent {

  readonly defaultHeight;
  readonly defaultWidth;

  @Input() zoom = 1;
  @Input() rotate = 0;
  @Input() height: number;
  @Input() width: number;

  @Input() canDelete: boolean;

  @Output() deleteHighlightEvent = new EventEmitter();

  rectangle: Rectangle;
  _rectangles: Rectangle[];

  constructor() {
    this.defaultHeight = 70;
    this.defaultWidth = 300;
  }

  @Input() set rectangles(rectangles: Rectangle[]) {
    if (rectangles) {
      this._rectangles = rectangles;
      this.rectangle = rectangles
        .reduce((prev, current) => prev.y < current.y ? prev : current);
    }
  }

  get rectangles() {
    return this._rectangles;
  }


  deleteHighlight() {
    this.deleteHighlightEvent.emit();
  }


  get transformStyles() {
    switch (this.rotate) {
      case 90:
        return { transformOrigin: 'top left', transform: 'rotate(-90deg)' };
      case 180:
        return { transformOrigin: 'center center', transform: 'rotate(-180deg)' };
      case 270:
        return { transformOrigin: 'top left', transform: 'rotate(-270deg)' };
    }
  }

  get top() {
    let popupTop;
    switch (this.rotate) {
      case 90:
        popupTop = (this.rectangle.y + (this.rectangle.height / 2)) * this.zoom + this.defaultWidth / 2;
        if (popupTop >= this.height) {
          return this.height;
        } else if (popupTop < this.defaultWidth) {
          return this.defaultWidth;
        } else {
          return popupTop;
        }
      case 180:
        popupTop = (this.rectangle.y + this.rectangle.height) * this.zoom + 10;
        return popupTop >= this.height - this.defaultHeight ? this.height - this.defaultHeight : popupTop;
      case 270:
        popupTop = (this.rectangle.y + (this.rectangle.height / 2)) * this.zoom - (this.defaultWidth / 2);
        if (popupTop <= 0) {
          return 0;
        } else if (popupTop > this.height - this.defaultWidth) {
          return this.height - this.defaultWidth;
        } else {
          return popupTop;
        }
      default:
        popupTop = this.rectangle.y * this.zoom - this.defaultHeight;
        return popupTop <= 0 ? this.defaultHeight : popupTop;
    }

  }

  get left() {
    let popupLeft;
    switch (this.rotate) {
      case 90:
        popupLeft = (this.rectangle.x * this.zoom) - this.defaultHeight;
        return popupLeft <= 0 ? this.defaultHeight : popupLeft;
      case 270:
        popupLeft = (this.rectangle.x + (this.rectangle.width)) * this.zoom + this.defaultHeight;
        return popupLeft >= this.width - this.defaultHeight ? this.width - this.defaultHeight : popupLeft;
      default:
        popupLeft = (this.rectangle.x + (this.rectangle.width / 2)) * this.zoom - (this.defaultWidth / 2);
        if (popupLeft <= 0) {
          return 0;
        } else if (popupLeft >= this.width - this.defaultWidth) {
          return this.width - this.defaultWidth;
        } else {
          return popupLeft;
        }

    }
  }
}
