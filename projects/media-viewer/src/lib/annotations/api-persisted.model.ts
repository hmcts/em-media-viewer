import { UserDetail } from './user-detail/user-detail.model';

export interface ApiPersisted {
  id: string;
  createdBy: string;
  createdByDetails: UserDetail;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedByDetails: UserDetail;
  lastModifiedDate: string;
}
