import {Injectable} from '@angular/core';
import {Annotation, AnnotationSet} from './annotation-set.model';


interface IAnnotationSetService {
  getAnnotationSet(annotationSetId: string): AnnotationSet;

  save(annotationSet: AnnotationSet): void;

  delete(annotation: Annotation): void;
}

@Injectable({
  providedIn: 'root'
})
export class AnnotationSetService implements IAnnotationSetService {

  // In this case the ID is the document-id
  getAnnotationSet(annotationSetId: string): AnnotationSet {
    return null;
  }

  save(annotationSet: AnnotationSet) {
    // should return a promise or observable?
  }

  delete(annotation: Annotation) {
    // should return a promise or observable?
  }

}
