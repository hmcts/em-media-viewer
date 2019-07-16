import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Annotation } from './annotation/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { AnnotationSet } from './annotation-set.model';
import { Rectangle } from './annotation/rectangle/rectangle.model';
import uuid from 'uuid';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { TextHighlight, ViewerEventService } from '../../viewers/viewer-event.service';
import { Subscription } from 'rxjs';
import { PageRenderEvent } from '../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper';

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

  selected = -1;
  drawStartX = -1;
  drawStartY = -1;

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly api: AnnotationApiService,
    private readonly annotationSetElement: ElementRef,
    public readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService
  ) {}

  ngOnInit(): void {
    console.log('init annotation-set');
    this.subscriptions.push(this.viewerEvents.highlightedText.subscribe((highlight) => this.createRectangles(highlight)));
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions that we may have
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  initialise(pageRenderEvent: PageRenderEvent) {
    this.zoom = pageRenderEvent.source.scale;
    this.rotate = pageRenderEvent.source.rotation;
    this.width = this.rotate % 180 === 0 ?
      pageRenderEvent.source.div.clientWidth : pageRenderEvent.source.div.clientHeight;
    this.height = this.rotate % 180 === 0 ?
      pageRenderEvent.source.div.clientHeight : pageRenderEvent.source.div.clientWidth;
    pageRenderEvent.source.div.appendChild(this.annotationSetElement.nativeElement);
  }

  private createTextHighlightAnnotation(highlightPage: number, rectangle: Rectangle[]): void {
    console.log('page = ' + highlightPage);
    console.log('annotationSetPage = ' + this.page);
    if (highlightPage === this.page) {
      const annotation = {
        id: uuid(),
        annotationSetId: this.annotationSet.id,
        color: 'FFFF00',
        comments: [],
        page: this.page,
        rectangles: rectangle,
        type: 'highlight'
      };
      console.log('creating annotation');
      this.api.postAnnotation(annotation).subscribe(a => this.annotationSet.annotations.push(a));
    }
  }

  async createRectangles(textHighlight: TextHighlight) {
    if (window.getSelection) {
      const selection = window.getSelection();

      if (selection.rangeCount && !selection.isCollapsed) {
        const range = selection.getRangeAt(0).cloneRange();

        if (range.getClientRects) {
          const rectangles = range.getClientRects();
          const selectionRectangles: Rectangle[] = [];
          for (let i = 0; i < rectangles.length; i++) {
            const zoomValue = this.zoom;
            const rect = rectangles[i];
            let width = (rect.right - rect.left) / zoomValue;
            let height = (rect.bottom - rect.top) / zoomValue;
            // Identify the localElement from the MouseEvent
            const localElement = (<Element>textHighlight.event.target) || (<Element>textHighlight.event.srcElement);
            // Get the VIEWPORT-relative coordinates of the rectangle. x & y including scroll offset
            const viewportX: number = rect.left;
            const viewportY: number = rect.top;
            // Get the bounding rectangle of the target parent (the textLayer)
            const boxRectangle = localElement.parentElement.getBoundingClientRect();
            // adjust the rectangle x and y taking into account the local container element
            let localX = 0;
            let localY = 0;

            switch (this.rotate) {
              case 90:
                localX = (viewportY - boxRectangle.top) / zoomValue;
                localY = this.height - ((viewportX - boxRectangle.left + width) / zoomValue);
                width = (rect.bottom - rect.top) / zoomValue;
                height = (rect.right - rect.left) / zoomValue;
                break;
              case 180:
                localX = this.width - (viewportX - boxRectangle.left + width) / zoomValue;
                localY = this.height - (viewportY - boxRectangle.top + height) / zoomValue;
                break;
              case 270:
                localX = this.width - ((viewportY - boxRectangle.top + height) / zoomValue);
                localY = (viewportX - boxRectangle.left) / zoomValue;
                width = (rect.bottom - rect.top) / zoomValue;
                height = (rect.right - rect.left) / zoomValue;
                break;
              default:
                localX = (viewportX - boxRectangle.left) / zoomValue;
                localY = (viewportY - boxRectangle.top) / zoomValue;
            }

            selectionRectangles.push({id: uuid(), x: localX, y: localY, height: height, width: width} as Rectangle);
          }

          await this.createTextHighlightAnnotation(textHighlight.page, selectionRectangles);

          // Clear down the native selection
          const selectedText = window.getSelection();
          selectedText.removeAllRanges();
        }
      }
    }
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
        setTimeout(() => this.selected = index, 0);
      });
  }

  public onAnnotationDelete(annotation: Annotation) {
    this.api
      .deleteAnnotation(annotation.id)
      .subscribe(() => {
        this.annotationSet.annotations = this.annotationSet.annotations.filter(a => a.id !== annotation.id);
      });
  }

  public onAnnotationSelected(selected: boolean, i: number) {
    this.selected = selected ? i : -1;
  }

  public onMouseDown(event: MouseEvent) {
    if (this.annotationSet && this.toolbarEvents.drawMode.value) {
      this.drawStartX = event.pageX - (window.scrollX + this.container.nativeElement.getBoundingClientRect().left);
      this.drawStartY = event.pageY - (window.scrollY + this.container.nativeElement.getBoundingClientRect().top);

      this.newRectangle.nativeElement.style.display = 'block';
      this.newRectangle.nativeElement.style.top =  this.drawStartY + 'px';
      this.newRectangle.nativeElement.style.left = this.drawStartX + 'px';
    }
  }

  public onMouseMove(event: MouseEvent) {
    if (this.annotationSet && this.toolbarEvents.drawMode.value && this.drawStartX > 0 && this.drawStartY > 0) {
      this.newRectangle.nativeElement.style.height =
        (event.pageY - this.drawStartY - (window.scrollY + this.container.nativeElement.getBoundingClientRect().top)) + 'px';
      this.newRectangle.nativeElement.style.width =
        (event.pageX - this.drawStartX - (window.scrollX + this.container.nativeElement.getBoundingClientRect().left)) + 'px';
    }
  }

  public onMouseUp() {
    if (this.annotationSet && this.toolbarEvents.drawMode.value) {
      const rectangle = {
        id: uuid(),
        x: +this.newRectangle.nativeElement.style.left.slice(0, -2),
        y: +this.newRectangle.nativeElement.style.top.slice(0, -2),
        width: +this.newRectangle.nativeElement.style.width.slice(0, -2),
        height: +this.newRectangle.nativeElement.style.height.slice(0, -2),
      };

      const annotation = {
        id: uuid(),
        annotationSetId: this.annotationSet.id,
        color: 'FFFF00',
        comments: [],
        page: 1,
        rectangles: [rectangle as Rectangle],
        type: 'highlight'
      };

      if (rectangle.height > 5 || rectangle.width > 5) {
        this.api
          .postAnnotation(annotation)
          .subscribe(a => this.annotationSet.annotations.push(a));

        this.toolbarEvents.drawMode.next(false);
      }

      this.drawStartX = -1;
      this.drawStartY = -1;
      this.newRectangle.nativeElement.style.display = 'none';
      this.newRectangle.nativeElement.style.width = '0';
      this.newRectangle.nativeElement.style.height = '0';
    }
  }
}
