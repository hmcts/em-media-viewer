import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Rectangle } from './rectangle.model';

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
}
