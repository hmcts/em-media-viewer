import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
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
  @Input() draggable: boolean;
  @Input() selected: boolean;
  @Output() update = new EventEmitter<Annotation>();
  @Output() select = new EventEmitter<boolean>();
  @Output() delete = new EventEmitter<Annotation>();

  editable = false;

  @ViewChild('container') container: ElementRef;

  public onSelect() {
    this.select.emit(true);
  }

  public onCommentDelete() {
    this.annotation.comments = [];
    this.update.emit(this.annotation);
  }

  public onCommentUpdate(text: string) {
    this.annotation.comments[0].content = text;
    this.update.emit(this.annotation);
  }

  public onRectangleUpdate(rectangle: Rectangle) {
    this.annotation.rectangles = this.annotation.rectangles.filter(r => r.id !== rectangle.id);
    this.annotation.rectangles.push(rectangle);

    this.update.emit(this.annotation);
  }

  public onFocusOut(event: FocusEvent) {
    if (!this.container.nativeElement.contains(event.relatedTarget)) {
      this.select.emit(false);
      this.editable = false;
    }
  }

  public deleteHighlight() {
    this.delete.emit(this.annotation);
  }

  public addOrEditComment() {
    if (this.annotation.comments.length == 0) {
      this.annotation.comments.push({
        annotationId: this.annotation.id,
        content: "",
        createdBy: "",
        createdByDetails: undefined,
        createdDate: new Date().getTime().toString(),
        id: uuid(),
        lastModifiedBy: "",
        lastModifiedByDetails: undefined,
        lastModifiedDate: ""
      });
    }
    this.select.emit(true);
    this.editable = true;
  }

  topRectangle() {
    return this.annotation.rectangles.reduce((prev, current) => prev.y < current.y ? prev : current);
  }
}
