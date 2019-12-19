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
  @Input() editable: boolean;

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
    if (this.hasRectangleChanged(this.rectangle, this.rectElement.nativeElement)) {
      this.rectangle.x = this.rectElement.nativeElement.offsetLeft / this.zoom;
      this.rectangle.y = this.rectElement.nativeElement.offsetTop / this.zoom;
      this.rectangle.width = this.rectElement.nativeElement.offsetWidth / this.zoom;
      this.rectangle.height = this.rectElement.nativeElement.offsetHeight / this.zoom;
      this.update.emit(this.rectangle);
    }
  }

  hasRectangleChanged({ x, y, width, height }, { offsetLeft, offsetTop, offsetWidth, offsetHeight }): boolean {
    return x !== (offsetLeft / this.zoom) || y !== (offsetTop / this.zoom) ||
      width !== (offsetWidth / this.zoom) || height !== (offsetHeight / this.zoom);
  }
}
