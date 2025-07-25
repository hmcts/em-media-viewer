import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Subscription } from 'rxjs';
import { Rectangle } from '../../annotation-view/rectangle/rectangle.model';
import { HighlightCreateService } from '../highlight-create/highlight-create.service';
import { ToolbarEventService } from '../../../../toolbar/toolbar-event.service';
import { HtmlTemplatesHelper } from '../../../../shared/util/helpers/html-templates.helper';
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

  @Output() saveSelection = new EventEmitter<{ rectangles: Rectangle[], page: number }>();

  @ViewChild('boxHighlight', { static: false }) highlight: ElementRef;

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
  wholePage: boolean;

  private subscriptions: Subscription[] = [];

  constructor(private readonly toolbarEvents: ToolbarEventService,
    private readonly highlightService: HighlightCreateService) { }

  ngOnInit(): void {
    this.subscriptions = [
      this.toolbarEvents.drawModeSubject.subscribe(drawMode => {
        this.defaultHeight = drawMode ? '100%' : '0px';
        this.defaultWidth = drawMode ? '100%' : '0px';
      }),
      this.toolbarEvents.redactWholePage.subscribe(() => {
        this.wholePage = true;
      })
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  initHighlight(event: MouseEvent) {
    if (this.wholePage) {
      this.highlightPage();
      return;
    }

    const rect = HtmlTemplatesHelper.getAdjustedBoundingRect((event.target as HTMLElement)),
    offsetX = event.clientX - rect.left,
    offsetY = event.clientY - rect.top;
    console.log(`initHighlight: rect=${JSON.stringify(rect)}, clientX=${event.clientX}, clientY=${event.clientY}, offsetX=${offsetX}, offsetY=${offsetY}`);

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

  updateHighlight(event: MouseEvent) {
    const rect = HtmlTemplatesHelper.getAdjustedBoundingRect(event.target as HTMLElement, false),
      offsetX = event.clientX - rect.left,
      offsetY = event.clientY - rect.top;
    if (this.drawStartX > 0 && this.drawStartY > 0) {
      this.height = Math.abs(offsetY - this.drawStartY);
      this.width = Math.abs(offsetX - this.drawStartX);
      this.top = Math.min(offsetY, this.drawStartY);
      this.left = Math.min(offsetX, this.drawStartX);
    }
  }

  createHighlight() {
    if (this.height / this.zoom > 5 || this.width / this.zoom > 5) {
      let rectangle = this.highlightService
        .applyRotation(this.pageHeight, this.pageWidth, this.height, this.width, this.top, this.left, this.rotate, this.zoom);
      rectangle = { id: uuid(), ...rectangle } as any;
      console.log(`createHighlight: rectangle=${JSON.stringify(rectangle)}`);
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
    this.backgroundColor = 'none';
    this.position = 'initial';
    this.wholePage = false;
  }

  private highlightPage() {
    this.height = this.pageHeight;
    this.width = this.pageWidth;
    this.top = 0;
    this.left = 0;
    this.createHighlight();
  }
}
