import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import uuid from 'uuid';
import { Subscription } from 'rxjs';
import { BoxHighlightCreateService } from './box-highlight-create.service';

@Component({
  selector: 'mv-box-highlight-create',
  templateUrl: './box-highlight-create.component.html',
  styleUrls: ['./box-highlight-create.component.scss']
})
export class BoxHighlightCreateComponent {

  @Input() pageHeight: number;
  @Input() pageWidth: number;
  @Input() rotate: number;
  @Input() zoom: number;
  @Input() container: { top: number, left: number };
  @Output() highlightCreated = new EventEmitter();

  @ViewChild('boxHighlight') highlight: ElementRef;

  drawStartX = -1;
  drawStartY = -1;
  top: string;
  left: string;
  height: string;
  width: string;
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
    this.drawStartX = event.pageX - (window.pageXOffset + this.container.left);
    this.drawStartY = event.pageY - (window.pageYOffset + this.container.top);

    this.display = 'block';
    this.height = '50px';
    this.width = '50px';

    switch (this.rotate) {
      case 90:
        this.top = this.pageHeight - this.drawStartX + 'px';
        this.left = this.drawStartY + 'px';
        break;
      case 180:
        this.top = this.pageHeight - this.drawStartY + 'px';
        this.left = this.pageWidth - this.drawStartX + 'px';
        break;
      case 270:
        this.top = this.drawStartX + 'px';
        this.left = this.pageWidth - this.drawStartY + 'px';
        break;
      default:
        this.top = this.drawStartY + 'px';
        this.left = this.drawStartX + 'px';
    }
  }

  update(event: MouseEvent) {
    if (this.drawStartX > 0 && this.drawStartY > 0) {
      const xDelta = event.pageX - this.drawStartX - (window.pageXOffset + this.container.left);
      const yDelta = event.pageY - this.drawStartY - (window.pageYOffset + this.container.top);
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
            height = -xDelta;
            width = -yDelta;
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
        x: +this.left.slice(0, -2) / this.zoom,
        y: +this.top.slice(0, -2) / this.zoom,
        width: +this.width.slice(0, -2) / this.zoom,
        height: +this.height.slice(0, -2) / this.zoom,
      });
      this.reset();
  }

  private reset() {
    this.drawStartX = -1;
    this.drawStartY = -1;
    this.display = 'none';
    this.width = '0px';
    this.height = '0px';
  }

  private setStyles(top, left, height, width) {
      this.height = Math.abs(height) + 'px';
      this.top = (height < 0 ? top - Math.abs(height) : top) + 'px';
      this.width = Math.abs(width) + 'px';
      this.left = (width < 0 ? left - Math.abs(width) : left) + 'px';
  }
}
