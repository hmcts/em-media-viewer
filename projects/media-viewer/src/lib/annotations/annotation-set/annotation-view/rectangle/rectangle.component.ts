import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Rectangle } from './rectangle.model';
import { Subscription } from 'rxjs';
import { ToolbarEventService } from '../../../../toolbar/toolbar-event.service';
import { HighlightCreateService } from '../../annotation-create/highlight-create.service';

@Component({
  selector: 'mv-anno-rectangle',
  templateUrl: './rectangle.component.html'
})
export class RectangleComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input() rectangle: Rectangle;
  @Input() color: String;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() editable: boolean;
  @Input() height: number;
  @Input() width: number;

  @Output() select = new EventEmitter<Rectangle>();
  @Output() update = new EventEmitter<Rectangle>();

  @ViewChild('rectElement') rectElement: ElementRef;

  private subscriptions: Subscription[] = [];
  _selected: boolean;
  enableGrabNDrag = false;
  prevRotation = 0;

  constructor(private readonly toolbarEvents: ToolbarEventService,
              private readonly highlightService: HighlightCreateService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.rotate) {
      this.adjustForRotation(this.rotate);
    }
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
    this.select.emit(this.rectangle);
  }

  onUpdate() {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = this.rectElement.nativeElement;
    if (this.hasRectangleChanged(this.rectangle, this.rectElement.nativeElement)) {
      let rectangle = this.highlightService.applyRotation(this.height, this.width, offsetHeight, offsetWidth, offsetTop, offsetLeft, this.rotate, this.zoom);
      rectangle = { ...this.rectangle, ...rectangle };
      this.update.emit({ ...rectangle });
    }
  }

  adjustForRotation(rotation: number) {
    const rect = { ...this.rectangle };
    switch (rotation) {
      case 90:
        rect.width = this.rectangle.height;
        rect.height = this.rectangle.width;
        rect.x = (this.width/this.zoom) - this.rectangle.y - this.rectangle.height;
        rect.y = this.rectangle.x;
        break;
      case 180:
        rect.x = (this.width/this.zoom) - this.rectangle.x - this.rectangle.width;
        rect.y = (this.height/this.zoom) - this.rectangle.y - this.rectangle.height;
        break;
      case 270:
        rect.width = this.rectangle.height;
        rect.height = this.rectangle.width;
        rect.x = this.rectangle.y;
        rect.y = (this.height/this.zoom) - this.rectangle.x - this.rectangle.width;
        break;
    }
    this.rectangle = {...rect};
  }

  hasRectangleChanged({ x, y, width, height }, { offsetLeft, offsetTop, offsetWidth, offsetHeight }): boolean {
    return x !== (offsetLeft / this.zoom) || y !== (offsetTop / this.zoom) ||
      width !== (offsetWidth / this.zoom) || height !== (offsetHeight / this.zoom);
  }
}
