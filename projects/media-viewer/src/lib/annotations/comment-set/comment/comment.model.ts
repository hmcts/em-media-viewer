import { ApiPersisted } from '../../api-persisted.model';
import { TagItemModel } from '../../models/tag-item.model';

export interface Comment extends ApiPersisted {
  annotationId: string;
  content: string;
  tags: TagItemModel[];
  page: number;
  pageHeight: number;
}
