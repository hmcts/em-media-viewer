import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import uuid from 'uuid';
import { Subscription } from 'rxjs';
import { BoxHighlightCreateService } from './box-highlight-create.service';

@Component({
  selector: 'mv-box-highlight-create',
  templateUrl: './box-highlight-create.component.html',
  styleUrls: ['./box-highlight-create.component.scss']
})
export class BoxHighlightCreateComponent implements OnInit, OnDestroy {

  @Input() pageHeight: number;
  @Input() pageWidth: number;
  @Input() rotate: number;
  @Input() zoom: number;
  @Input() container: { top: number, left: number };
  @Output() highlightCreated = new EventEmitter();

  @ViewChild('boxHighlight') highlight: ElementRef;

  drawStartX = -1;
  drawStartY = -1;
  top: number;
  left: number;
  height: number;
  width: number;
  display: string;

  private subscriptions: Subscription[] = [];

  constructor(private readonly boxHighlightEvents: BoxHighlightCreateService) {}

  ngOnInit(): void {
    this.subscriptions = [
      this.boxHighlightEvents.initHighlight.subscribe(event => this.init(event)),
      this.boxHighlightEvents.updateHighlight.subscribe(event => this.update(event)),
      this.boxHighlightEvents.createHighlight.subscribe(event => this.create())
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    });
  }

  init(event) {
    this.drawStartX = event.pageX - window.pageXOffset - this.container.left;
    this.drawStartY = event.pageY - window.pageYOffset - this.container.top;

    this.display = 'block';
    this.height = 50;
    this.width = 50;

    switch (this.rotate) {
      case 90:
        this.top = this.pageHeight - this.drawStartX - this.height;
        this.left = this.drawStartY;
        break;
      case 180:
        this.top = this.pageHeight - this.drawStartY - this.height;
        this.left = this.pageWidth - this.drawStartX - this.width;
        break;
      case 270:
        this.top = this.drawStartX;
        this.left = this.pageWidth - this.drawStartY - this.width;
        break;
      default:
        this.top = this.drawStartY;
        this.left = this.drawStartX;

    }
  }

  update(event: MouseEvent) {
    if (this.drawStartX > 0 && this.drawStartY > 0) {
      const xDelta = event.pageX - this.drawStartX - window.pageXOffset - this.container.left;
      const yDelta = event.pageY - this.drawStartY - window.pageYOffset - this.container.top;
      let height = yDelta;
      let width = xDelta;
      let top = this.drawStartY;
      let left = this.drawStartX;

      switch (this.rotate) {
        case 90:
            height = -xDelta;
            width = yDelta;
            top = this.pageHeight - this.drawStartX;
            left = this.drawStartY;
          break;
        case 180:
            height = -yDelta;
            width = -xDelta;
            top = this.pageHeight - this.drawStartY;
            left = this.pageWidth - this.drawStartX;
          break;
        case 270:
            height = xDelta;
            width = -yDelta;
            top = this.drawStartX;
            left = this.pageWidth - this.drawStartY;
          break;
      }
      this.setStyles(top, left, height, width);
    }
  }

  create() {
      this.highlightCreated.emit({
        id: uuid(),
        x: +this.left /this.zoom,
        y: +this.top /this.zoom,
        width: +this.width / this.zoom,
        height: +this.height / this.zoom,
      });
      this.reset();
  }

  private reset() {
    this.drawStartX = -1;
    this.drawStartY = -1;
    this.display = 'none';
    this.width = 0;
    this.height = 0;
  }

  private setStyles(top, left, height, width) {
      this.height = Math.abs(height);
      this.top = height < 0 ? top - Math.abs(height) : top;
      this.width = Math.abs(width);
      this.left = width < 0 ? left - Math.abs(width) : left;
  }
}
