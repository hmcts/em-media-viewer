import { ApiPersisted } from '../api-persisted.model';

export interface Comment extends ApiPersisted {
  annotationId: string;
  content: string;
}
