import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface SelectionAnnotation {
  annotationId: string;
  editable: boolean;
  selected: boolean;
}

@Injectable()
export class AnnotationEventService {
  public readonly selectedAnnotation = new Subject<SelectionAnnotation>();

  constructor() {}
  // todo to remove
  // public selectAnnotation(annotation: SelectionAnnotation): void {
  //   this.selectedAnnotation.next(annotation);
  // }
  //
  // getSelectedAnnotation(): Observable<SelectionAnnotation> {
  //   return this.selectedAnnotation.asObservable();
  // }
}
