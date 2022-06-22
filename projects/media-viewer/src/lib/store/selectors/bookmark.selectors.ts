import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers/reducers';
import * as fromBookmarks from '../reducers/bookmarks.reducer';
import { generateBookmarkNodes } from '../bookmarks-store-utils';
import * as fromDocument from './document.selectors';

export const getBookmarkState = createSelector(
  fromFeature.getMVState,
  (state: fromFeature.State) =>  state.bookmarks
);

export const getBookmarkPages = createSelector(
  getBookmarkState,
  fromBookmarks.getBookmarkPageEnt
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
  fromDocument.getPages,
  (bookmarkNodes, docId, pdfPosition, pages) => {
    return {
      pageNumber: pdfPosition.pageNumber - 1,
      xCoordinate: pdfPosition.left,
      yCoordinate: pages[pdfPosition.pageNumber].styles.height - (pdfPosition.top * pages[pdfPosition.pageNumber].viewportScale),
      previous: bookmarkNodes.length > 0 ? bookmarkNodes[bookmarkNodes.length - 1].id : undefined,
      documentId: '/documentsv2/' + docId
    };
  }
);

export const getBookmarksPerPage = createSelector(
  fromDocument.getPages,
  getBookmarkPages,
  (pages, pageEnt) => {
    if (pages && pageEnt) {
      const arr = [];
      Object.keys(pages).forEach(key => {
        const pageIdx = Number(key) - 1; // -1 as the thisPages array is 0 indexed
        const thisPage = pageEnt[pageIdx];
        arr.push({
          bookmark: thisPage ? thisPage : [],
          styles: pages[key].styles
        });
      });
      return arr;
    }
  }
);
