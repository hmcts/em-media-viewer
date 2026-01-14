import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Subscription } from 'rxjs';
import { Rectangle } from '../../annotation-view/rectangle/rectangle.model';
import { HighlightCreateService } from '../highlight-create/highlight-create.service';
import { ToolbarEventService } from '../../../../toolbar/toolbar-event.service';
import { HtmlTemplatesHelper } from '../../../../shared/util/helpers/html-templates.helper';
import { KeyboardBoxDrawEvent, CursorPosition } from './keyboard-box-draw.directive';

@Component({
    selector: 'mv-box-highlight-create',
    templateUrl: './box-highlight-create.component.html',
    standalone: false
})
export class BoxHighlightCreateComponent implements OnInit, OnDestroy {

  @Input() page: number;
  @Input() pageHeight: number;
  @Input() pageWidth: number;
  @Input() rotate: number;
  @Input() zoom: number;
  @Input() container: { top: number, left: number };

  @Output() saveSelection = new EventEmitter<{ rectangles: Rectangle[], page: number, annotationId?: string }>();

  @ViewChild('boxHighlight', { static: false }) highlight: ElementRef;
  @ViewChild('drawingContainer', { static: false }) drawingContainer: ElementRef;

  drawStartX = -1;
  drawStartY = -1;

  top: number;
  left: number;
  height: number;
  width: number;
  display: string;
  position: string;
  backgroundColor = 'none';

  drawMode: boolean;
  defaultHeight: string;
  defaultWidth: string;
  wholePage: boolean;

  keyboardDrawingMode = false;
  cursorX: number;
  cursorY: number;
  showCursor = false;

  private subscriptions: Subscription[] = [];

  constructor(private readonly toolbarEvents: ToolbarEventService,
    private readonly highlightService: HighlightCreateService) { }

  ngOnInit(): void {
    this.subscriptions = [
      this.toolbarEvents.drawModeSubject.subscribe(drawMode => {
        this.defaultHeight = drawMode ? '100%' : '0px';
        this.defaultWidth = drawMode ? '100%' : '0px';
        this.drawMode = drawMode;
        if (drawMode) {
          setTimeout(() => {
            if (this.drawingContainer?.nativeElement && this.isElementInViewport(this.drawingContainer.nativeElement)) {
              this.drawingContainer.nativeElement.focus();
            }
          }, 100);
        }
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

  private isElementInViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    const verticallyVisible = rect.bottom > 0 && rect.top < windowHeight;
    const horizontallyVisible = rect.right > 0 && rect.left < windowWidth;

    return verticallyVisible && horizontallyVisible;
  }

  initHighlight(event: MouseEvent) {
    if (this.wholePage) {
      this.highlightPage();
      return;
    }

    const rect = HtmlTemplatesHelper.getAdjustedBoundingRect((event.target as HTMLElement)),
    offsetX = event.clientX - rect.left,
    offsetY = event.clientY - rect.top;

    this.position = 'absolute';
    this.backgroundColor = 'yellow';
    this.drawStartX = offsetX;
    this.drawStartY = offsetY;

    this.display = 'block';
    this.height = 50;
    this.width = 50;
    this.top = this.drawStartY;
    this.left = this.drawStartX;

    this.adjustForRotation();
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
      const annotationId = uuid();
      rectangle = { id: annotationId, ...rectangle } as any;
      this.saveSelection.emit({ rectangles: [rectangle], page: this.page, annotationId });
      this.resetHighlight();
    }
  }

  onCursorPositionChanged(position: CursorPosition): void {
    this.cursorX = position.x;
    this.cursorY = position.y;
    this.showCursor = position.visible;
  }

  onDrawingStarted(event: KeyboardBoxDrawEvent): void {
    this.keyboardDrawingMode = true;
    this.position = 'absolute';
    this.backgroundColor = 'yellow';
    this.display = 'block';

    this.drawStartX = event.startX;
    this.drawStartY = event.startY;
    this.width = event.width;
    this.height = event.height;
    this.top = this.drawStartY;
    this.left = this.drawStartX;

    this.adjustForRotation();
  }

  onDrawingUpdated(event: KeyboardBoxDrawEvent): void {
    this.width = event.width;
    this.height = event.height;
  }

  onDrawingConfirmed(event: KeyboardBoxDrawEvent): void {
    this.keyboardDrawingMode = false;
    this.createHighlight();
  }

  onDrawingCancelled(): void {
    this.keyboardDrawingMode = false;
    this.resetHighlight();
  }

  private adjustForRotation(): void {
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
