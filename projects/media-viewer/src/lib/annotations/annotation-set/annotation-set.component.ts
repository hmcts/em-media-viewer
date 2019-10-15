import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Annotation } from './annotation/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { AnnotationSet } from './annotation-set.model';
import { Rectangle } from './annotation/rectangle/rectangle.model';
import uuid from 'uuid';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { Highlight, ViewerEventService } from '../../viewers/viewer-event.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';
import { AnnotationService, SelectionAnnotation } from '../annotation.service';

@Component({
  selector: 'mv-annotation-set',
  styleUrls: ['./annotation-set.component.scss'],
  templateUrl: './annotation-set.component.html'
})
export class AnnotationSetComponent implements OnInit, OnDestroy {

  @Input() annotationSet: AnnotationSet;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() width: number;
  @Input() height: number;
  @Input() page: number;

  @ViewChild('shapeRectangle') shapeRectangle: ElementRef;
  @ViewChild('container') container: ElementRef;

  selectedAnnotation: SelectionAnnotation = { annotationId: '', editable: false };
  drawStartX = -1;
  drawStartY = -1;

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly api: AnnotationApiService,
    public readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    private readonly annotationService: AnnotationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(this.viewerEvents.highlightedText.subscribe((highlight) => this.createTextHighlight(highlight)));
    this.subscriptions.push(this.viewerEvents.highlightedShape.subscribe((highlight) => this.initShapeRectangle(highlight.event)));
    this.subscriptions.push(this.annotationService.getSelectedAnnotation()
      .subscribe((selectedAnnotation) => this.selectedAnnotation = selectedAnnotation));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  addToDOM(eventSource: PageEvent['source']) {
    this.zoom = eventSource.scale;
    this.rotate = eventSource.rotation;
    const element = eventSource.div;
    this.width = this.rotate % 180 === 0 ? element.clientWidth : element.clientHeight;
    this.height = this.rotate % 180 === 0 ? element.clientHeight : element.clientWidth;
    element.appendChild(this.container.nativeElement);
  }

  public onAnnotationUpdate(annotation: Annotation) {
    this.api
      .postAnnotation(annotation)
      .subscribe(newAnnotation => {
        const index = this.annotationSet.annotations.findIndex(a => a.id === newAnnotation.id);

        this.annotationSet.annotations[index] = newAnnotation;
        this.onAnnotationClick({ annotationId: annotation.id, editable: false });
      });
  }

  public onAnnotationDelete(annotation: Annotation) {
    this.api
      .deleteAnnotation(annotation.id)
      .subscribe(() => {
        this.annotationSet.annotations = this.annotationSet.annotations.filter(a => a.id !== annotation.id);
        this.onAnnotationClick({ annotationId: '', editable: false });
      });
  }

  public onMouseDown(event: MouseEvent) {
    this.initShapeRectangle(event);
  }

  public onMouseMove(event: MouseEvent) {
    this.updateShapeRectangle(event);
  }

  public onMouseUp() {
    this.createShapeHighlight();
  }

  private createShapeHighlight() {
    if (this.annotationSet && this.toolbarEvents.drawMode.value) {
      const rectangle = {
        id: uuid(),
        x: +this.shapeRectStyle().left.slice(0, -2) / this.zoom,
        y: +this.shapeRectStyle().top.slice(0, -2) / this.zoom,
        width: +this.shapeRectStyle().width.slice(0, -2) / this.zoom,
        height: +this.shapeRectStyle().height.slice(0, -2) / this.zoom,
      };

      const annotation = this.createAnnotation([rectangle as Rectangle]);

      if (rectangle.height > 5 || rectangle.width > 5) {
        this.api
          .postAnnotation(annotation)
          .subscribe(annotation => this.annotationSet.annotations.push(annotation));

        this.toolbarEvents.drawMode.next(false);
        this.onAnnotationClick({ annotationId: annotation.id, editable: false });
      }
      this.resetShapeRectangle();
    }
  }

  async createTextHighlight(highlight: Highlight) {
    if (highlight.page === this.page) {
      if (window.getSelection()) {
        const selection = window.getSelection();

        if (selection.rangeCount && !selection.isCollapsed) {
          const range = selection.getRangeAt(0).cloneRange();
          const clientRects = range.getClientRects();

          if (clientRects) {
            const localElement = (<Element>highlight.event.target) || (<Element>highlight.event.srcElement);
            const textLayerRect = localElement.parentElement.getBoundingClientRect();

            const selectionRectangles: Rectangle[] = [];
            for (let i = 0; i < clientRects.length; i++) {
              const selectionRectangle = this.createTextRectangle(clientRects[i], textLayerRect);
              selectionRectangles.push(selectionRectangle);
            }
            const annotation = this.createAnnotation(selectionRectangles);
            this.api.postAnnotation(annotation).subscribe(a => this.annotationSet.annotations.push(a));
            this.onAnnotationClick({ annotationId: annotation.id, editable: false });
            selection.removeAllRanges();
            this.toolbarEvents.highlightMode.next(false);
          }
        }
      }
    }
  }

  private createTextRectangle(rect: any, textLayerRect: any) {
    const rectangle = {
      id: uuid(),
      x: 0,
      y: 0,
      height: (rect.bottom - rect.top) / this.zoom,
      width: (rect.right - rect.left) / this.zoom
    };

    switch (this.rotate) {
      case 90:
        rectangle.width = (rect.bottom - rect.top) / this.zoom;
        rectangle.height = (rect.right - rect.left) / this.zoom;
        rectangle.x = (rect.top - textLayerRect.top) / this.zoom;
        rectangle.y = ((this.height - (rect.left - textLayerRect.left)) / this.zoom) - rectangle.height;
        break;
      case 180:
        rectangle.x = ((this.width - (rect.left - textLayerRect.left)) / this.zoom) - rectangle.width;
        rectangle.y = ((this.height - (rect.top - textLayerRect.top)) / this.zoom) - rectangle.height;
        break;
      case 270:
        rectangle.width = (rect.bottom - rect.top) / this.zoom;
        rectangle.height = (rect.right - rect.left) / this.zoom;
        rectangle.x = ((this.width - (rect.top - textLayerRect.top)) / this.zoom) - rectangle.width;
        rectangle.y = (rect.left - textLayerRect.left) / this.zoom;
        break;
      default:
        rectangle.x = (rect.left - textLayerRect.left) / this.zoom;
        rectangle.y = (rect.top - textLayerRect.top) / this.zoom;
    }
    return rectangle as Rectangle;
  }

  private createAnnotation(rectangles: Rectangle[]): Partial<Annotation> {
    return {
      id: uuid(),
      annotationSetId: this.annotationSet.id,
      color: 'FFFF00',
      comments: [],
      page: this.page,
      rectangles: rectangles,
      type: 'highlight'
    };
  }


  private initShapeRectangle(event: MouseEvent) {
    if (this.annotationSet && this.toolbarEvents.drawMode.value) {

      this.drawStartX = event.pageX - (window.pageXOffset + this.containerRectangle().left);
      this.drawStartY = event.pageY - (window.pageYOffset + this.containerRectangle().top);

      this.shapeRectStyle().display = 'block';

      switch (this.rotate) {
        case 90:
          this.shapeRectStyle().top = this.height - this.drawStartX + 'px';
          this.shapeRectStyle().left = this.drawStartY + 'px';
          break;
        case 180:
          this.shapeRectStyle().top = this.height - this.drawStartY + 'px';
          this.shapeRectStyle().left = this.width - this.drawStartX + 'px';
          break;
        case 270:
          this.shapeRectStyle().top = this.drawStartX + 'px';
          this.shapeRectStyle().left = this.width - this.drawStartY + 'px';
          break;
        default:
          this.shapeRectStyle().top = this.drawStartY + 'px';
          this.shapeRectStyle().left = this.drawStartX + 'px';
      }
    }
  }

  private updateShapeRectangle(event: MouseEvent) {
    if (this.annotationSet && this.toolbarEvents.drawMode.value) {

      const rectangle = {
        top: this.drawStartY,
        left: this.drawStartX,
        height: this.height,
        width: this.width
      };
      let shapeRectPos;
      if (this.drawStartX > 0 && this.drawStartY > 0) {
        switch (this.rotate) {
          case 90:
            rectangle.height = -(event.pageX - this.drawStartX - (window.pageXOffset + this.containerRectangle().left));
            rectangle.width = (event.pageY - this.drawStartY - (window.pageYOffset + this.containerRectangle().top));
            rectangle.top = this.height - this.drawStartX;
            rectangle.left = this.drawStartY;
            break;
          case 180:
            rectangle.height = -(event.pageY - this.drawStartY - (window.pageYOffset + this.containerRectangle().top));
            rectangle.width = -(event.pageX - this.drawStartX - (window.pageXOffset + this.containerRectangle().left));
            rectangle.top = this.height - this.drawStartY;
            rectangle.left = this.width - this.drawStartX;
            break;
          case 270:
            rectangle.height = (event.pageX - this.drawStartX - (window.pageXOffset + this.containerRectangle().left));
            rectangle.width = -(event.pageY - this.drawStartY - (window.pageYOffset + this.containerRectangle().top));
            rectangle.top = this.drawStartX;
            rectangle.left = this.width - this.drawStartY;
            break;
          default:
            rectangle.height = (event.pageY - this.drawStartY - (window.pageYOffset + this.containerRectangle().top));
            rectangle.width = (event.pageX - this.drawStartX - (window.pageXOffset + this.containerRectangle().left));
        }
        shapeRectPos = this.calculateRectPos(rectangle.top, rectangle.left, rectangle.height, rectangle.width);
        this.shapeRectStyle().top = shapeRectPos.top + 'px';
        this.shapeRectStyle().left = shapeRectPos.left + 'px';
        this.shapeRectStyle().height = shapeRectPos.height + 'px';
        this.shapeRectStyle().width = shapeRectPos.width + 'px';
      }
    }
  }

  private resetShapeRectangle() {
    this.drawStartX = -1;
    this.drawStartY = -1;
    this.shapeRectStyle().display = 'none';
    this.shapeRectStyle().width = '0';
    this.shapeRectStyle().height = '0';
  }

  onAnnotationClick(annotationId) {
    this.annotationService.onAnnotationSelection(annotationId);
  }

  public getAnnotationsOnPage(): Annotation[] {
    if (this.annotationSet) {
      return this.annotationSet.annotations.filter(a => a.page === this.page);
    }
  }

  private shapeRectStyle() {
    return this.shapeRectangle.nativeElement.style;
  }

  private containerRectangle() {
    return this.container.nativeElement.getBoundingClientRect();
  }

  calculateRectPos(top, left, height, width) {
    if (height < 0) {
      height = Math.abs(height);
      top -= height;
    }

    if (width < 0) {
      width = Math.abs(width);
      left -= width;
    }

    return {
      top: top,
      left: left,
      height: height,
      width: width
    };
  }
}
