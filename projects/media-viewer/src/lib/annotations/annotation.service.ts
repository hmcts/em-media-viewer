import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class AnnotationService {
  public readonly selectedAnnotation = new Subject<string>();

  constructor() {}

  public onAnnotationSelection(annotationId: string): void {
    this.selectedAnnotation.next(annotationId);
  }
}
