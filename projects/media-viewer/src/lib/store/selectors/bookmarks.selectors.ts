import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers/reducers';
import * as fromBookmarks from '../reducers/bookmarks.reducer';
import { StoreUtils } from '../store-utils';
import { Bookmark } from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';
import * as fromDocument from '../selectors/document.selectors';


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

export const getBookmarkInfo = createSelector(
  fromDocument.getDocumentId,
  fromDocument.getPdfPosition,
  (documentId, pdfPosition) => {
    return {
      pageNumber: pdfPosition.pageNumber - 1,
      xCoordinate: pdfPosition.left,
      yCoordinate: pdfPosition.top,
      documentId
    }
  }
);

export const getBookmarkNodes = createSelector(
  getBookmarkEntities,
  (entities) => StoreUtils.generateBookmarkNodes(entities)
);
