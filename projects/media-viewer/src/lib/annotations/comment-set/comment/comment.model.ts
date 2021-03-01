import { ApiPersisted } from '../../models/api-persisted.model';
import { TagsModel } from '../../models/tags.model';

export interface Comment extends ApiPersisted {
  annotationId: string;
  content: string;
  tags: TagsModel[];
  page: number;
  pages: object;
  pageHeight: number;
  selected: boolean;
  editable: boolean;
}
