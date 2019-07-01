import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Rectangle } from './rectangle.model';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';

@Component({
  selector: 'mv-anno-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent {

  @Input() selected: boolean;
  @Input() rectangle: Rectangle;
  @Input() color: String;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() draggable = true;

  @Output() click = new EventEmitter();
  @Output() update = new EventEmitter<Rectangle>();
  @Output() delete = new EventEmitter<string>();

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

  deleteHighlight() {
    this.delete.emit(this.rectangle.id);
  }
}
