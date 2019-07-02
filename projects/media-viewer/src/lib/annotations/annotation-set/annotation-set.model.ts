import { ApiPersisted } from '../api-persisted.model';
import { Annotation } from './annotation/annotation.model';

export interface AnnotationSet extends ApiPersisted {
  documentId: string;
  annotations: Annotation[];
}
