import { ApiPersisted } from '../../api-persisted.model';
import { Rectangle } from './rectangle/rectangle.model';
import { Comment } from '../../comment-set/comment/comment.model';
import {TagsModel} from '../../models/tags.model';

export interface Annotation extends ApiPersisted {
  annotationSetId?: string;
  annotationId?: string;
  page?: number;
  color?: string;
  comments?: Comment[];
  rectangles?: Rectangle[];
  type?: string;
  tags: TagsModel[];
  redactionId?: string;
}
