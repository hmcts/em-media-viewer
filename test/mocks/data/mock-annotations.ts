import { Annotation } from '../../../projects/media-viewer/src/lib/annotations/annotation-set/annotation-view/annotation.model';

export const mockAnnotations: Array<Annotation> = [{
  createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
  createdByDetails: {
    forename: 'em-showcase',
    surname: 'testuser',
    email: 'emshowcase@hmcts.net'
  },
  lastModifiedByDetails: {
    forename: 'em-showcase',
    surname: 'testuser',
    email: 'emshowcase@hmcts.net'
  },
  createdDate: '2019-05-28T08:48:19.681Z',
  lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
  lastModifiedDate: '2019-05-28T08:48:33.206Z',
  id: '123',
  page: 1,
  color: 'FFFF00',
  annotationSetId: '8f7aa07c-2343-44e3-b3db-bf689066d00e',
  comments: [],
  rectangles: [{
    annotationId: '123',
    height: 100,
    width: 100,
    x: 50,
    y: 50,
    id: null,
    createdBy: null,
    createdByDetails: null,
    createdDate: null,
    lastModifiedBy: null,
    lastModifiedByDetails: null,
    lastModifiedDate: null
  }],
  type: 'highlight',
  tags: []
}];
