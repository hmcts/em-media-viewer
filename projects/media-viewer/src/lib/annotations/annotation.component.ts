import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Annotation } from './annotation.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'mv-annotation',
  templateUrl: './annotation.component.html'
})
export class AnnotationComponent {

  @Input() annotation: Annotation;
  @Input() commentsLeftOffset: number;
  @Input() zoom: number;
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

  public updateComment(text: string) {
    this.annotation.comments[0].content = text;

    this.update.emit(this.annotation);
  }
}
