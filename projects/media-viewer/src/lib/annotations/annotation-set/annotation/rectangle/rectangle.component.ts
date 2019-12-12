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
      x: this.rectElement.nativeElement.offsetLeft,
      y: this.rectElement.nativeElement.offsetTop,
      width: this.rectElement.nativeElement.offsetWidth,
      height: this.rectElement.nativeElement.offsetHeight
    };
    if (this.rectangle.x !== currentRectElement.x || this.rectangle.y !== currentRectElement.y
      || this.rectangle.width !== currentRectElement.width || this.rectangle.height !== currentRectElement.height) {
      this.rectangle.x = currentRectElement.x / this.zoom;
      this.rectangle.y = currentRectElement.y / this.zoom;
      this.rectangle.width = currentRectElement.width / this.zoom;
      this.rectangle.height = currentRectElement.height / this.zoom;
      this.update.emit(this.rectangle);
    }
  }
}
