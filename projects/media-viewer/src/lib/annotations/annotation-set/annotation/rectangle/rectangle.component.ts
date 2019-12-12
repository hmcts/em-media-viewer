import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Rectangle } from './rectangle.model';

@Component({
  selector: 'mv-anno-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent implements AfterViewInit {

  @Input() rectangle: Rectangle;
  @Input() color: String;
  @Input() zoom: number;
  @Input() rotate: number;

  @Output() select = new EventEmitter<Rectangle>();
  @Output() update = new EventEmitter<Rectangle>();

  @ViewChild('rectElement') rectElement: ElementRef;

  _selected: boolean;

  ngAfterViewInit() {
    if (this.selected) {
      this.rectElement.nativeElement.focus();
    }
  }

  @Input()
  set selected(selected: boolean) {
    this._selected = selected;
    if (this._selected) {
      this.rectElement.nativeElement.focus();
    }
  }

  get selected() {
    return this._selected;
  }

  onClick() {
    this.select.emit(this.rectangle);
  }

  onUpdate() {
    const currentRectElement = {
      _x: this.rectElement.nativeElement.offsetLeft,
      _y: this.rectElement.nativeElement.offsetTop,
      _width: this.rectElement.nativeElement.offsetWidth,
      _height: this.rectElement.nativeElement.offsetHeight
    };
    if (this.hasRectangleChanged(this.rectangle, currentRectElement)) {
      this.rectangle.x = currentRectElement._x / this.zoom;
      this.rectangle.y = currentRectElement._y / this.zoom;
      this.rectangle.width = currentRectElement._width / this.zoom;
      this.rectangle.height = currentRectElement._height / this.zoom;
      this.update.emit(this.rectangle);
    }
  }

  hasRectangleChanged({ x, y, width, height }, { _x, _y, _width, _height }): boolean {
    return x !== _x || y !== _y || width !== _width || height !== _height;
  }
}
