import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Rectangle } from './rectangle.model';
import { Subscription } from 'rxjs';
import { ToolbarEventService } from '../../../../toolbar/toolbar-event.service';

@Component({
  selector: 'mv-anno-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['../../../../../assets/sass/rectangle.scss']
})
export class RectangleComponent implements AfterViewInit, OnDestroy {

  @Input() rectangle: Rectangle;
  @Input() color: String;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() editable: boolean;

  @Output() select = new EventEmitter<Rectangle>();
  @Output() update = new EventEmitter<Rectangle>();

  @ViewChild('rectElement') rectElement: ElementRef;

  private subscriptions: Subscription[] = [];
  _selected: boolean;
  enableGrabNDrag = false;

  constructor(private readonly toolbarEvents: ToolbarEventService) {
  }

  ngAfterViewInit() {
    if (this.selected) {
      this.rectElement.nativeElement.focus();
    }
    this.subscriptions.push(
      this.toolbarEvents.grabNDrag.subscribe(grabNDrag => this.enableGrabNDrag = grabNDrag)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.filter(subscription => !subscription.closed)
      .forEach(subscription => subscription.unsubscribe());
  }

  @Input()
  set selected(selected: boolean) {
    this._selected = selected;
    if (this._selected && this.rectElement) {
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
