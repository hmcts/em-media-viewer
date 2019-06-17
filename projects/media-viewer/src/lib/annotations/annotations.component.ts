import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Annotation } from './annotation.model';

@Component({
  selector: 'mv-annotation',
  templateUrl: './annotations.component.html'
})
export class AnnotationsComponent {

  @Input() annotation: Annotation;
  @Input() commentsLeftOffset: number;
  @Input() zoom: number;
  @Input() draggable: boolean;
  @Output() update = new EventEmitter<Annotation>();

  commentSelected = false;
  highlightSelected = false;

  public selectComment() {
    this.commentSelected = true;
  }

  public selectHighlight() {
    this.highlightSelected = true;
  }

  public deleteComment() {
    this.annotation.comments = [];

    this.update.emit(this.annotation);
  }
}
