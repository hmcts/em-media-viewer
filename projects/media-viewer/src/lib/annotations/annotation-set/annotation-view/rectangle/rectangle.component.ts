import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Rectangle } from './rectangle.model';
import { Subscription } from 'rxjs';
import { ToolbarEventService } from '../../../../toolbar/toolbar-event.service';

@Component({
  selector: 'mv-anno-rectangle',
  templateUrl: './rectangle.component.html'
})
export class RectangleComponent implements AfterViewInit, OnDestroy {

  @Input() set rectangle(rect) {
    this.rect = {...rect};
  }
  rect: Rectangle;
  @Input() color: String;
  @Input() zoom: number;
  @Input() editable: boolean;

  @Output() select = new EventEmitter<Rectangle>();
  @Output() update = new EventEmitter<Rectangle>();

  @ViewChild('rectElement') rectElement: ElementRef;

  _rotate: number;
  @Input() set rotate(rotate) {
    this._rotate = rotate;
    const rect = { ...this.rect };
    switch (this.rotate) {
      case 90:
        this.rect.width = rect.height;
        this.rect.height = rect.width;
        this.rect.x = (1122/this.zoom) - rect.y - rect.height;
        this.rect.y = rect.x;
        break;
      case 180:
        this.rect.x = (793/this.zoom) - rect.x - rect.width;
        this.rect.y = (1122/this.zoom) - rect.y - rect.height;
        break;
      case 270:
        this.rect.width = rect.height;
        this.rect.height = rect.width;
        this.rect.x = rect.y;
        this.rect.y = (793/this.zoom) - rect.x - rect.width;
        break;
    }
  }

  get rotate() {
    return this._rotate;
  }

  private subscriptions: Subscription[] = [];
  _selected: boolean;
  enableGrabNDrag = false;

  constructor(private readonly toolbarEvents: ToolbarEventService) {
  }

  ngAfterViewInit() {
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
    this.select.emit(this.rect);
  }

  onUpdate() {
    if (this.hasRectangleChanged(this.rect, this.rectElement.nativeElement)) {
      this.rect.x = this.rectElement.nativeElement.offsetLeft / this.zoom;
      this.rect.y = this.rectElement.nativeElement.offsetTop / this.zoom;
      this.rect.width = this.rectElement.nativeElement.offsetWidth / this.zoom;
      this.rect.height = this.rectElement.nativeElement.offsetHeight / this.zoom;
      this.update.emit(this.rect);
    }
  }

  hasRectangleChanged({ x, y, width, height }, { offsetLeft, offsetTop, offsetWidth, offsetHeight }): boolean {
    return x !== (offsetLeft / this.zoom) || y !== (offsetTop / this.zoom) ||
      width !== (offsetWidth / this.zoom) || height !== (offsetHeight / this.zoom);
  }
}
