import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers/reducers';
import * as fromBookmarks from '../reducers/bookmarks.reducer';
import * as fromDocument from '../selectors/document.selectors';
import { generateBookmarkNodes } from '../bookmarks-store-utils';


export const getBookmarkState = createSelector(
  fromFeature.getMVState,
  (state: fromFeature.State) =>  state.bookmarks
);


export const getBookmarkEntities = createSelector(
  getBookmarkState,
  fromBookmarks.getBookmarkEnts
);

export const getBookmarkNodes = createSelector(
  getBookmarkEntities,
  (entities) => generateBookmarkNodes(entities)
);

export const getEditableBookmark = createSelector(
  getBookmarkState,
  fromBookmarks.getEditBookmark
);

export const getBookmarkInfo = createSelector(
  getBookmarkNodes,
  fromDocument.getDocumentId,
  fromDocument.getPdfPosition,
  (bookmarkNodes, documentId, pdfPosition) => {
    return {
      pageNumber: pdfPosition.pageNumber - 1,
      xCoordinate: pdfPosition.left,
      yCoordinate: pdfPosition.top,
      previous: bookmarkNodes.length > 0 ? bookmarkNodes[bookmarkNodes.length - 1].id : undefined,
      documentId
    }
  }
);
