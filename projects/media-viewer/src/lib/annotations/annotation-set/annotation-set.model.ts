import { ApiPersisted } from '../models/api-persisted.model';
import { Annotation } from './annotation-view/annotation.model';

export interface AnnotationSet extends ApiPersisted {
  documentId: string;
  annotations: Annotation[];
}
