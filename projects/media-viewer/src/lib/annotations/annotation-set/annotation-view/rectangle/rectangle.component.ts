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

  @Input() color: String;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() editable: boolean;
  @Input() pageHeight: number;
  @Input() pageWidth: number;

  @Output() select = new EventEmitter<Rectangle>();
  @Output() update = new EventEmitter<Rectangle>();

  @ViewChild('rectElement', { static: false }) viewRect: ElementRef;

  private subscriptions: Subscription[] = [];
  _selected: boolean;
  enableGrabNDrag = false;

  height: number;
  width: number;
  top: number;
  left: number;

  _annoRect: Rectangle;
  @Input()
  set annoRect(annoRect: Rectangle) {
    this._annoRect = { ...annoRect };
    this.height = +(annoRect.height * this.zoom).toFixed(2);
    this.width = +(annoRect.width * this.zoom).toFixed(2);
    this.left = +(annoRect.x * this.zoom).toFixed(2);
    this.top = +(annoRect.y * this.zoom).toFixed(2);
  }

  get annoRect() {
    return this._annoRect;
  }


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
    if (this._selected && this.viewRect) {
      this.viewRect.nativeElement.focus();
    }
  }

  get selected() {
    return this._selected;
  }

  onClick() {
    this.select.emit(this.annoRect);
  }

  onUpdate(viewRect: any) {
    const { offsetHeight, offsetWidth, offsetTop, offsetLeft } = viewRect;
    if (this.hasRectangleChanged(viewRect)) {
      let rectangle = this.highlightService
        .applyRotation(this.pageHeight, this.pageWidth, offsetHeight, offsetWidth, offsetTop, offsetLeft, this.rotate, this.zoom);
      rectangle = { ...this.annoRect, ...rectangle };
      this.update.emit({ ...rectangle });
    }
  }

  adjustForRotation(rotation: number) {
    const { top, left, height, width } = this;
    switch (rotation) {
      case 90:
        this.width = height;
        this.height = width;
        this.left = this.pageWidth  - top - height;
        this.top = left;
        break;
      case 180:
        this.left = this.pageWidth - left - width;
        this.top = this.pageHeight - top - height;
        break;
      case 270:
        this.width = height;
        this.height = width;
        this.left = top;
        this.top = this.pageHeight - left - width;
        break;
    }
  }

  hasRectangleChanged(viewRect): boolean {
    return this.left !== viewRect.offsetLeft ||
      this.top !== viewRect.offsetTop ||
      this.width !== viewRect.offsetWidth ||
      this.height !== viewRect.offsetHeight;
  }
}
