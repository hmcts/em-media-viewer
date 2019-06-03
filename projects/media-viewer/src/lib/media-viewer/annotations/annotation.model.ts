import { ApiPersisted } from './api-persisted.model';
import { Rectangle } from './rectangle/rectangle.model';

export interface Annotation extends ApiPersisted {
  objectId: string;
  annotationSetId: string;
  page: number;
  color: string;
  comments: Comment[];
  rectangles: Rectangle[];
  type: string;
}
