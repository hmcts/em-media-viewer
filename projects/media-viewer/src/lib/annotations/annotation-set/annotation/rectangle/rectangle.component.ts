import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Rectangle } from './rectangle.model';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';

@Component({
  selector: 'mv-anno-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent {

  @Input() rectangle: Rectangle;
  @Input() color: String;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() draggable: boolean;

  @Output() click = new EventEmitter();
  @Output() update = new EventEmitter<Rectangle>();

  _selected = false;
  @ViewChild('rectElement') rectElement: ElementRef;

  @Input()
  set selected(selected: boolean) {
    this._selected = selected;
    if (this._selected) {
      setTimeout(() => this.rectElement.nativeElement.focus(), 0);
    }
  }

  get selected() {
    return this._selected;
  }

  onClick() {
    this.click.emit();
  }

  onMove(el: HTMLElement) {
    const [left, top] = el.style.transform.match(/\d+/g);

    const newX = +left / this.zoom;
    const newY = +top / this.zoom;

    if (Math.abs(newX - this.rectangle.x) > 2 || Math.abs(newY - this.rectangle.y)) {
      this.rectangle.x = newX;
      this.rectangle.y = newY;
      this.update.emit(this.rectangle);
    }
  }

  onResize(event: IResizeEvent) {
    this.rectangle.width = event.size.width / this.zoom;
    this.rectangle.height = event.size.height / this.zoom;

    this.update.emit(this.rectangle);
  }
}
