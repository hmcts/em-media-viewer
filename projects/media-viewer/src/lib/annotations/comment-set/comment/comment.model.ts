import { ApiPersisted } from '../../api-persisted.model';
import { TagsModel } from '../../models/tags.model';

export interface Comment extends ApiPersisted {
  annotationId: string;
  content: string;
  tags: TagsModel[];
  page: number;
  pageHeight: number;
  selected: boolean;
  editable: boolean;
}
