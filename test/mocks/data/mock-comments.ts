import { Comment } from '../../../projects/media-viewer/src/lib/annotations/comment-set/comment/comment.model';

export const mockComments: Array<Comment> = [{
  id: '16d5c513-15f9-4c39-8102-88bdb85d8831',
  annotationId: '4f3f9361-6d17-4689-81dd-5cb2e317b329',
  createdDate: '2018-05-28T08:48:33.206Z',
  createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
  createdByDetails: {
      'forename': 'Linus',
      'surname': 'Norton',
      'email': 'linus.norton@hmcts.net'
    },
  lastModifiedDate: '2019-05-28T08:48:33.206Z',
  lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
  lastModifiedByDetails: {
      'forename': 'Jeroen',
      'surname': 'Rijks',
      'email': 'jeroen.rijks@hmcts.net'
    },
  content: 'This is a comment.',
  tags: [],
  selected: true,
  editable: true,
  page: 1,
  pageHeight: 1122,
  pages: { 1: { styles: { height: 200 }}}
}];
