import { ApiPersisted } from '../../api-persisted.model';
import { Rectangle } from './rectangle/rectangle.model';
import { Comment } from '../../comment-set/comment/comment.model';

export interface Annotation extends ApiPersisted {
  annotationSetId: string;
  page: number;
  color: string;
  comments: Comment[];
  rectangles: Rectangle[];
  type: string;
}
