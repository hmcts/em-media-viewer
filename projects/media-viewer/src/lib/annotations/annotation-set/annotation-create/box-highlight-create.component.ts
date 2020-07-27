import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import uuid from 'uuid';
import { Subscription } from 'rxjs';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';
import { Rectangle } from '../annotation-view/rectangle/rectangle.model';


@Component({
  selector: 'mv-box-highlight-create',
  templateUrl: './box-highlight-create.component.html',
})
export class BoxHighlightCreateComponent implements OnInit, OnDestroy {

  @Input() page: number;
  @Input() pageHeight: number;
  @Input() pageWidth: number;
  @Input() rotate: number;
  @Input() zoom: number;
  @Input() container: { top: number, left: number };

  @Output() saveSelection = new EventEmitter<{ rectangles: Rectangle[], page: number }>()

  @ViewChild('boxHighlight') highlight: ElementRef;

  drawStartX = -1;
  drawStartY = -1;
  top: number;
  left: number;
  height: number;
  width: number;
  display: string;
  drawMode: boolean;
  defaultHeight: string;
  defaultWidth: string;
  position: string;
  backgroundColor = 'none';

  private subscriptions: Subscription[] = [];

  constructor(private readonly toolbarEvents: ToolbarEventService) {}

  ngOnInit(): void {
    this.subscriptions = [
      this.toolbarEvents.drawModeSubject.subscribe(drawMode => {
        this.defaultHeight = drawMode ? '100%' : '0px';
        this.defaultWidth = drawMode ? '100%' : '0px';
      })
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    });
  }

  initHighlight({ offsetX, offsetY }) {
    this.position = 'absolute';
    this.backgroundColor = 'yellow';
    this.drawStartX = offsetX;
    this.drawStartY = offsetY;

    this.display = 'block';
    this.height = 50;
    this.width = 50;

    this.top = this.drawStartY;
    this.left = this.drawStartX;

    switch (this.rotate) {
      case 90:
        this.top = this.drawStartY - this.height;
        break;
      case 180:
        this.top = this.drawStartY - this.height;
        this.left = this.drawStartX - this.width;
        break;
      case 270:
        this.left = this.drawStartX - this.width;
        break;
    }
  }

  updateHighlight({ offsetX, offsetY }) {
    if (this.drawStartX > 0 && this.drawStartY > 0) {
      this.height = Math.abs(offsetY - this.drawStartY);
      this.width = Math.abs(offsetX - this.drawStartX);
      this.top = Math.min(offsetY, this.drawStartY);
      this.left = Math.min(offsetX, this.drawStartX);
    }
  }

  createHighlight() {
    if (this.height / this.zoom > 5 || this.width / this.zoom > 5) {
      const rectangle = {
        id: uuid(),
        x: this.left / this.zoom,
        y: this.top / this.zoom,
        width: this.width / this.zoom,
        height: this.height / this.zoom,
        page: this.page
      } as any;
      switch (this.rotate) {
        case 90:
          rectangle.width = this.height;
          rectangle.height = this.width;
          rectangle.x = this.top;
          rectangle.y = (1122/this.zoom) - this.left - this.width;
          break;
        case 180:
          rectangle.x = (793/this.zoom) - this.left - this.width;
          rectangle.y = (1122/this.zoom) - this.top - this.height;
          break;
        case 270:
          rectangle.width = this.height;
          rectangle.height = this.width;
          rectangle.x = (793/this.zoom) - this.top - this.height;
          rectangle.y = this.left;
          break;
      }
      console.log(`x=${rectangle.x}, y=${rectangle.y}, height=${rectangle.height}, width=${rectangle.width}`)
      this.saveSelection.emit({ rectangles: [rectangle], page: this.page });
      this.resetHighlight();
    }
  }

  private resetHighlight() {
    this.drawStartX = -1;
    this.drawStartY = -1;
    this.display = 'none';
    this.width = 0;
    this.height = 0;
  }
}
