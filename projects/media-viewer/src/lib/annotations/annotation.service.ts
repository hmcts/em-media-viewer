import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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

  getSelectedAnnotation(): Observable<SelectionAnnotation> {
    return this.selectedAnnotation.asObservable();
  }
}
