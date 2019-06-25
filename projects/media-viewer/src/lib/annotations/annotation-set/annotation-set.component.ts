import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Annotation } from './annotation/annotation.model';
import { AnnotationApiService } from '../annotation-api.service';
import { AnnotationSet } from './annotation-set.model';

@Component({
  selector: 'mv-annotation-set',
  styleUrls: ['./annotation-set.component.scss'],
  templateUrl: './annotation-set.component.html'
})
export class AnnotationSetComponent {

  @Input() annotationSet: AnnotationSet;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() width: number;
  @Input() height: number;
  @Input() page: number;
  @Output() update = new EventEmitter<Annotation>();

  constructor(
    private readonly api: AnnotationApiService
  ) {}

  public getAnnotationsOnPage(): Annotation[] {
    return this.annotationSet.annotations.filter(a => a.page === this.page);
  }

  public onAnnotationUpdate(annotation: Annotation) {
    const annotations = this.annotationSet.annotations.filter(a => a.id !== annotation.id);

    annotations.push(annotation);

    this.annotationSet.annotations = annotations;
    this.api.postAnnotationSet(this.annotationSet);
  }
}
