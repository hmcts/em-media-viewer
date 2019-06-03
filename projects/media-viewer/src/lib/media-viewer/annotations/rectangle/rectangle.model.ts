import { ApiPersisted } from '../api-persisted.model';

export interface Rectangle extends ApiPersisted {
  height: number;
  width: number;
  x: number;
  y: number;
}
