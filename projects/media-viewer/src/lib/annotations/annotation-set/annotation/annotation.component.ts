import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Annotation } from './annotation.model';
import { Rectangle } from './rectangle/rectangle.model';

@Component({
  selector: 'mv-annotation',
  styleUrls: ['./annotation.component.scss'],
  templateUrl: './annotation.component.html'
})
export class AnnotationComponent {

  @Input() annotation: Annotation;
  @Input() commentsLeftOffset: number;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() selected: boolean;
  @Input() height: number;
  @Input() width: number;
  @Output() update = new EventEmitter<Annotation>();
  @Output() delete = new EventEmitter<Annotation>();
  @Output() annotationClick = new EventEmitter();

  @ViewChild('container') container: ElementRef;

  public onSelect() {
    this.selected = true;
    this.annotationClick.emit({ annotationId: this.annotation.id, editable: false });
  }

  public onRectangleUpdate(rectangle: Rectangle) {
    this.annotation.rectangles = this.annotation.rectangles.filter(r => r.id !== rectangle.id);
    this.annotation.rectangles.push(rectangle);

    this.update.emit(this.annotation);
  }

  public onFocusOut(event: FocusEvent) {
    if (!this.container.nativeElement.contains(event.relatedTarget)) {
      this.selected = false;
      // this.annotationClick.emit({ annotationId: '', editable: false });
    }
  }

  public deleteHighlight() {
    this.delete.emit(this.annotation);
  }

  public addOrEditComment() {
    if (this.annotation.comments.length === 0) {
      this.annotation.comments.push({
        annotationId: this.annotation.id,
        content: '',
        createdBy: '',
        createdByDetails: undefined,
        createdDate: new Date().getTime().toString(),
        id: uuid(),
        lastModifiedBy: '',
        lastModifiedByDetails: undefined,
        lastModifiedDate: ''
      });
    }
    this.selected = true;
    this.annotationClick.emit({ annotationId: this.annotation.id, editable: true });
  }

  topRectangle() {
    return this.annotation.rectangles.reduce((prev, current) => prev.y < current.y ? prev : current);
  }
}
