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
    const newX = this.rectElement.nativeElement.offsetLeft / this.zoom;
    const newY = this.rectElement.nativeElement.offsetTop / this.zoom;
    const newWidth = this.rectElement.nativeElement.offsetWidth / this.zoom;
    const newHeight = this.rectElement.nativeElement.offsetHeight / this.zoom;

    if (Math.abs(newX - this.rectangle.x) > 2 || Math.abs(newY - this.rectangle.y)) {
      this.rectangle.x = newX;
      this.rectangle.y = newY;
      this.rectangle.width = newWidth;
      this.rectangle.height = newHeight;
      this.update.emit(this.rectangle);
    }
  }
}
