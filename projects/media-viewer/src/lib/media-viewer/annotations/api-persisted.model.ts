import { User } from './user/user.model';

export interface ApiPersisted {
  id: string;
  annotationId: string;
  createdBy: string;
  createdByDetails: User;
  createdDate: any;
  lastModifiedBy: string;
  lastModifiedByDetails: User;
  lastModifiedDate: any;
}
