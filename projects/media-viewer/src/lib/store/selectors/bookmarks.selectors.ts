import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers/reducers';
import * as fromBookmarks from '../reducers/bookmarks.reducer';
import { Bookmark } from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';
import * as fromAnnotations from '../selectors/annotations.selectors';
import uuid from 'uuid';


export const getBookmarkState = createSelector(
  fromFeature.getMVState,
  (state: fromFeature.State) =>  state.bookmarks
);

export const getBookmarkEntities = createSelector(
  getBookmarkState,
  fromBookmarks.getBookmarkEnts
);

export const getAllBookmarks = createSelector(
  getBookmarkEntities,
  (entities: { [id: string]: Bookmark }) => Object.keys(entities).map(id => entities[id])
);

export const getEditableBookmark = createSelector(
  getBookmarkState,
  fromBookmarks.getEditBookmark
);

export const getPdfPosition = createSelector(
  getBookmarkState,
  fromBookmarks.getPdfPos
);

export const getBookmarkInfo = createSelector(
  fromAnnotations.getDocumentIdSetId,
  getPdfPosition,
  (docSetId, pdfPosition) => {
    return {
      pageNumber: pdfPosition.pageNumber - 1,
      xCoordinate: pdfPosition.left,
      yCoordinate: pdfPosition.top,
      documentId: docSetId.documentId
    }
  }
);
