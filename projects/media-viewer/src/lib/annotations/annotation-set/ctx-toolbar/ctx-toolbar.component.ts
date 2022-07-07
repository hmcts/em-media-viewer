import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { Rectangle } from '../annotation-view/rectangle/rectangle.model';

@Component({
  selector: 'mv-ctx-toolbar',
  templateUrl: './ctx-toolbar.component.html'
})
export class CtxToolbarComponent implements OnChanges {

  readonly defaultHeight;
  readonly defaultWidth;

  @Input() zoom;
  @Input() rotate;
  @Input() pageHeight: number;
  @Input() pageWidth: number;

  @Input() canHighlight: boolean;
  @Input() canBookmark: boolean;
  @Input() canComment: boolean;
  @Input() canDelete: boolean;

  @Output() createHighlightEvent = new EventEmitter();
  @Output() deleteHighlightEvent = new EventEmitter();
  @Output() addOrEditCommentEvent = new EventEmitter();
  @Output() createBookmarkEvent = new EventEmitter<Rectangle>();

  rectangle: Rectangle;
  _rectangles: Rectangle[];
  top: number;
  left: number;

  constructor() {
    this.defaultHeight = 70;
    this.defaultWidth = 300;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setRectangle();
    this.top = this.popupTop();
    this.left = this.popupLeft();
  }

  @Input() set rectangles(rectangles: Rectangle[]) {
    if (rectangles) {
      this._rectangles = rectangles;
      this.setRectangle();
    }
  }

  get rectangles() {
    return this._rectangles;
  }

  createHighlight() {
    this.createHighlightEvent.emit();
    this.rectangle = undefined;
  }

  deleteHighlight() {
    this.deleteHighlightEvent.emit();
  }

  addOrEditComment() {
    this.addOrEditCommentEvent.emit();
    setTimeout(() => {
      document.getElementById('viewerContainer').scrollBy(0, 1);
    }, 10);
  }

  createBookmark() {
    this.createBookmarkEvent.emit(this.rectangle);
    this.rectangle = undefined;
  }

  setRectangle() {
    const rectangle = this.rectangles
      .reduce((prev, current) => prev.y < current.y ? prev : current);
    this.rectangle =  { ...rectangle };
    switch (this.rotate) {
      case 90:
        this.rectangle.width = rectangle.height;
        this.rectangle.height = rectangle.width;
        this.rectangle.x = (this.pageWidth / this.zoom) - rectangle.y - rectangle.height;
        this.rectangle.y = rectangle.x;
        break;
      case 180:
        this.rectangle.x = (this.pageWidth / this.zoom) - rectangle.x - rectangle.width;
        this.rectangle.y = (this.pageHeight / this.zoom) - rectangle.y - rectangle.height;
        break;
      case 270:
        this.rectangle.width = rectangle.height;
        this.rectangle.height = rectangle.width;
        this.rectangle.x = rectangle.y;
        this.rectangle.y = (this.pageHeight / this.zoom) - rectangle.x - rectangle.width;
        break;
    }
  }

  popupTop() {
    const popupTop = this.rectangle.y * this.zoom - this.defaultHeight;
    return popupTop <= 0 ? this.defaultHeight : popupTop;
  }

  popupLeft() {
    const popupLeft = (this.rectangle.x + (this.rectangle.width / 2)) * this.zoom - (this.defaultWidth / 2);
    if (popupLeft <= 0) {
      return 0;
    } else if (popupLeft >= this.pageWidth - this.defaultWidth) {
      return this.pageWidth - this.defaultWidth;
    } else {
      return popupLeft;
    }
  }
}
