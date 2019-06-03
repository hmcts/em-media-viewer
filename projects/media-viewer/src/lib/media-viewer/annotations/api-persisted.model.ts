import { User } from './user/user.model';

export interface ApiPersisted {
  id: string;
  createdBy: string;
  createdByDetails: User;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedByDetails: User;
  lastModifiedDate: string;
}
