import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Annotation } from './annotation.model';
import { Subject } from 'rxjs';
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
  @Output() update = new EventEmitter<Annotation>();
  selected = false;

  public toggleSelection(selected: boolean) {
    this.selected = selected;
  }

  public deleteComment() {
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
}
