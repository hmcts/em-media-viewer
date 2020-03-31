import { ApiPersisted } from '../../api-persisted.model';
import { Rectangle } from './rectangle/rectangle.model';
import { Comment } from '../../comment-set/comment/comment.model';
import {TagItemModel} from '../../models/tag-item.model';

export interface Annotation extends ApiPersisted {
  annotationSetId?: string;
  annotationId?: string;
  page?: number;
  color?: string;
  comments?: Comment[];
  rectangles?: Rectangle[];
  type?: string;
  tags: TagItemModel[];
}
