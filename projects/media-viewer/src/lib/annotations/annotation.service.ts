import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface SelectionAnnotation {
  annotationId: string;
  editable: boolean;
}

@Injectable()
export class AnnotationService {
  public readonly selectedAnnotation = new Subject<SelectionAnnotation>();

  constructor() {}

  public onAnnotationSelection(annotation: SelectionAnnotation): void {
    this.selectedAnnotation.next(annotation);
  }
}
