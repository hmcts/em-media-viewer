import { ApiPersisted } from '../api-persisted.model';

export interface Comment extends ApiPersisted {
  content: string;
}
