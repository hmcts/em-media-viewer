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

  @ViewChild('newRectangle') newRectangle: ElementRef;
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
    console.log('init annotation-set');
    this.subscriptions.push(this.viewerEvents.highlightedText.subscribe((highlight) => this.createRectangles(highlight)));
    this.subscriptions.push(this.viewerEvents.highlightedShape.subscribe((highlight) => this.onMouseDown(highlight.event)));
    this.subscriptions.push(this.annotationService.getSelectedAnnotation()
      .subscribe((selectedAnnotation) => this.selectedAnnotation = selectedAnnotation));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  initialise(eventSource: PageEvent['source']) {
    this.zoom = eventSource.scale;
    this.rotate = eventSource.rotation;
    const element = eventSource.div;
    this.width = this.rotate % 180 === 0 ? element.clientWidth : element.clientHeight;
    this.height = this.rotate % 180 === 0 ? element.clientHeight : element.clientWidth;
    element.appendChild(this.container.nativeElement);
  }

  onAnnotationClick(annotationId) {
    this.annotationService.onAnnotationSelection(annotationId);
  }

  async createRectangles(highlight: Highlight) {
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
              const selectionRectangle = this.createRectangle(clientRects[i], textLayerRect);
              selectionRectangles.push(selectionRectangle);
            }
            await this.createAnnotation(selectionRectangles);
            selection.removeAllRanges();
          }
        }
      }
    }
  }

  private createRectangle(rect: any, textLayerRect: any) {
    const rectangle = {
      id: uuid(),
      x: 0,
      y: 0,
      height: (rect.bottom - rect.top) / this.zoom,
      width: (rect.right - rect.left) / this.zoom
    };

    switch (this.rotate) {
      case 90:
        rectangle.x = (rect.top - textLayerRect.top) / this.zoom;
        rectangle.y = ((this.height - (rect.left - textLayerRect.left)) / this.zoom) - rectangle.height;
        rectangle.height = (rect.right - rect.left) / this.zoom;
        rectangle.width = (rect.bottom - rect.top) / this.zoom;
        break;
      case 180:
        rectangle.x = ((this.width - (rect.left - textLayerRect.left)) / this.zoom) - rectangle.width;
        rectangle.y = ((this.height - (rect.top - textLayerRect.top)) / this.zoom) - rectangle.height;
        break;
      case 270:
        rectangle.x = ((this.width - (rect.top - textLayerRect.top)) / this.zoom) - rectangle.width;
        rectangle.y = (rect.left - textLayerRect.left) / this.zoom;
        rectangle.height = (rect.right - rect.left) / this.zoom;
        rectangle.width = (rect.bottom - rect.top) / this.zoom;
        break;
      default:
        rectangle.x = (rect.left - textLayerRect.left) / this.zoom;
        rectangle.y = (rect.top - textLayerRect.top) / this.zoom;
    }
    return rectangle as Rectangle;
  }

  private createAnnotation(rectangles: Rectangle[]): void {
    const annotation = {
        id: uuid(),
        annotationSetId: this.annotationSet.id,
        color: 'FFFF00',
        comments: [],
        page: this.page,
        rectangles: rectangles,
        type: 'highlight'
    };
    this.api.postAnnotation(annotation).subscribe(a => this.annotationSet.annotations.push(a));
    this.onAnnotationClick({ annotationId: annotation.id, editable: false });
  }

  public getAnnotationsOnPage(): Annotation[] {
    return this.annotationSet.annotations.filter(a => a.page === this.page);
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
    if (this.annotationSet && this.toolbarEvents.drawMode.value) {
      this.initialiseNewRect(event);
    }
  }

  public onMouseMove(event: MouseEvent) {
    if (this.annotationSet && this.toolbarEvents.drawMode.value) {
      this.updateNewRect(event);
    }
  }

  public onMouseUp() {
    if (this.annotationSet && this.toolbarEvents.drawMode.value) {
      const rectangle = {
        id: uuid(),
        x: +this.newRectStyle().left.slice(0, -2) / this.zoom,
        y: +this.newRectStyle().top.slice(0, -2) / this.zoom,
        width: +this.newRectStyle().width.slice(0, -2) / this.zoom,
        height: +this.newRectStyle().height.slice(0, -2) / this.zoom,
      };

      const annotation = {
        id: uuid(),
        annotationSetId: this.annotationSet.id,
        color: 'FFFF00',
        comments: [],
        page: this.page,
        rectangles: [rectangle as Rectangle],
        type: 'highlight'
      };

      if (rectangle.height > 5 || rectangle.width > 5) {
        this.api
          .postAnnotation(annotation)
          .subscribe(a => this.annotationSet.annotations.push(a));

        this.toolbarEvents.drawMode.next(false);
        this.onAnnotationClick({ annotationId: annotation.id, editable: false });
      }
      this.resetNewRect();
    }
  }

  private initialiseNewRect(event: MouseEvent) {
    this.drawStartX = event.pageX - (window.scrollX + this.containerRect().left);
    this.drawStartY = event.pageY - (window.scrollY + this.containerRect().top);

    this.newRectStyle().display = 'block';

    switch (this.rotate) {
      case 90:
        this.newRectStyle().top =  this.height - this.drawStartX + 'px';
        this.newRectStyle().left = this.drawStartY + 'px';
        break;
      case 180:
        this.newRectStyle().top =  this.height - this.drawStartY + 'px';
        this.newRectStyle().left = this.width - this.drawStartX + 'px';
        break;
      case 270:
        this.newRectStyle().top =  this.drawStartX + 'px';
        this.newRectStyle().left = this.width - this.drawStartY + 'px';
        break;
      default:
        this.newRectStyle().top =  this.drawStartY + 'px';
        this.newRectStyle().left = this.drawStartX + 'px';
    }
  }

  private updateNewRect(event: MouseEvent) {
    const rect = {
      top: this.drawStartY,
      left: this.drawStartX,
      height: this.height,
      width: this.width
    };
    let newRectPos;
    if (this.drawStartX > 0 && this.drawStartY > 0) {
      switch (this.rotate) {
        case 90:
          rect.height = -(event.pageX - this.drawStartX - (window.scrollX + this.containerRect().left));
          rect.width = (event.pageY - this.drawStartY - (window.scrollY + this.containerRect().top));
          rect.top = this.height - this.drawStartX;
          rect.left = this.drawStartY;
          break;
        case 180:
          rect.height = -(event.pageY - this.drawStartY - (window.scrollY + this.containerRect().top));
          rect.width = -(event.pageX - this.drawStartX - (window.scrollX + this.containerRect().left));
          rect.top =  this.height - this.drawStartY;
          rect.left = this.width - this.drawStartX;
          break;
        case 270:
          rect.height = (event.pageX - this.drawStartX - (window.scrollX + this.containerRect().left));
          rect.width = -(event.pageY - this.drawStartY - (window.scrollY + this.containerRect().top));
          rect.top =  this.drawStartX;
          rect.left = this.width - this.drawStartY;
          break;
        default:
          rect.height = (event.pageY - this.drawStartY - (window.scrollY + this.containerRect().top));
          rect.width = (event.pageX - this.drawStartX - (window.scrollX + this.containerRect().left));
      }
      newRectPos = this.calculateRectPos(rect.top, rect.left, rect.height, rect.width);
      this.newRectStyle().top = newRectPos.top + 'px';
      this.newRectStyle().left = newRectPos.left + 'px';
      this.newRectStyle().height = newRectPos.height + 'px';
      this.newRectStyle().width = newRectPos.width + 'px';
    }
  }

  private resetNewRect() {
    this.drawStartX = -1;
    this.drawStartY = -1;
    this.newRectStyle().display = 'none';
    this.newRectStyle().width = '0';
    this.newRectStyle().height = '0';
  }

  private newRectStyle() {
    return this.newRectangle.nativeElement.style;
  }

  private containerRect() {
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
