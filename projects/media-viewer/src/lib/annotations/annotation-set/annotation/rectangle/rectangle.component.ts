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
  @Input() selected: boolean;

  @Output() select = new EventEmitter<Rectangle>();
  @Output() update = new EventEmitter<Rectangle>();

  @ViewChild('rectElement') rectElement: ElementRef;

  onClick() {
    this.select.emit(this.rectangle);
  }

  ngAfterViewInit() {
    if (this.selected) {
      this.rectElement.nativeElement.focus();
    }
  }
}
