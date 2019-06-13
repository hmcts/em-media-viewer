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
  @Input() selectedAnnotation: Subject<string>;
  @Output() update = new EventEmitter<Annotation>();

  public selectAnnotation() {
    this.selectedAnnotation.next(this.annotation.id);
  }

  public deleteComment() {
    this.annotation.comments = [];

    this.update.emit(this.annotation);
  }
}
