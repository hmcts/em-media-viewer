export interface BookmarksState {
  bookmarks: Bookmark[],
  bookmarkEntities: { [id: string]: Bookmark },
  editableBookmark: string,
  loaded: boolean,
  loading: boolean
}

export interface Bookmark {
  id: string;
  documentId: string;
  name: string;
  pageNumber: number;
  xCoordinate: number;
  yCoordinate: number;
}

export interface PdfLocation {
  pageNumber: number;
  scale: number;
  top: number;
  left: number;
  rotation: number;
}
