export interface Bookmark {
  id: string;
  documentId: string;
  name: string;
  pageNumber: number;
  xCoordinate: number;
  yCoordinate: number;
  zoom: number;
  parent: string;
  previous: string;
  children: Bookmark[];
  index: number;
}

export interface BookmarkNode {
  id: string;
  name: string;
  children: string[];
}

export interface BookmarkMoveEvent {
  node: Bookmark;
  from: {
    parent: string,
    next: Bookmark
  };
  to: {
    parent: string,
    previous: string,
    next: Bookmark
  };
}
