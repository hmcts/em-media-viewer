import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Annotation } from './annotation/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { AnnotationSet } from './annotation-set.model';
import { Rectangle } from './annotation/rectangle/rectangle.model';
import uuid from 'uuid';

@Component({
  selector: 'mv-annotation-set',
  styleUrls: ['./annotation-set.component.scss'],
  templateUrl: './annotation-set.component.html'
})
export class AnnotationSetComponent {

  @Input() annotationSet: AnnotationSet;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() width: number;
  @Input() height: number;
  @Input() page: number;
  @Input() drawMode: boolean;

  @Output() update = new EventEmitter<Annotation>();

  @ViewChild('newRectangle') newRectangle: ElementRef;
  @ViewChild('container') container: ElementRef;

  selected = -1;
  drawStartX = -1;
  drawStartY = -1;

  constructor(
    private readonly api: AnnotationApiService
  ) {}

  public getAnnotationsOnPage(): Annotation[] {
    return this.annotationSet.annotations.filter(a => a.page === this.page);
  }

  public onAnnotationUpdate(annotation: Annotation) {
    const annotations = this.annotationSet.annotations.filter(a => a.id !== annotation.id);

    annotations.push(annotation);

    this.annotationSet.annotations = annotations;
    this.api.postAnnotationSet(this.annotationSet);
  }

  public onAnnotationSelected(selected: boolean, i: number) {
    this.selected = selected ? i : -1;
  }

  public onMouseDown(event: MouseEvent) {
    if (this.annotationSet && this.drawMode) {
      this.drawStartX = event.pageX - (window.scrollX + this.container.nativeElement.getBoundingClientRect().left);
      this.drawStartY = event.pageY - (window.scrollY + this.container.nativeElement.getBoundingClientRect().top);

      this.newRectangle.nativeElement.style.display = 'block';
      this.newRectangle.nativeElement.style.top =  this.drawStartY + 'px';
      this.newRectangle.nativeElement.style.left = this.drawStartX + 'px';
    }

    return false;
  }

  public onMouseMove(event: MouseEvent) {
    if (this.annotationSet && this.drawMode && this.drawStartX > 0 && this.drawStartY > 0) {
      this.newRectangle.nativeElement.style.height =
        (event.pageY - this.drawStartY - (window.scrollY + this.container.nativeElement.getBoundingClientRect().top)) + 'px';
      this.newRectangle.nativeElement.style.width =
        (event.pageX - this.drawStartX - (window.scrollX + this.container.nativeElement.getBoundingClientRect().left)) + 'px';
    }

    return false;
  }

  public onMouseUp() {
    if (this.annotationSet && this.drawMode) {
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

      this.api
        .postAnnotation(annotation)
        .subscribe(a => this.annotationSet.annotations.push(a));

      this.drawStartX = -1;
      this.drawStartY = -1;
      this.newRectangle.nativeElement.style.display = 'none';
      this.newRectangle.nativeElement.style.width = '0';
      this.newRectangle.nativeElement.style.height = '0';

    }

    this.selected = -1;

    return false;
  }
}
