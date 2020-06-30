export interface Bookmark {
  id: string;
  documentId: string;
  name: string;
  pageNumber: number;
  xCoordinate: number;
  yCoordinate: number;
  children: any[];
  previous: string;
  index: number;
}

export interface PdfPosition {
  pageNumber: number;
  top: number;
  left: number;
  rotation: number;
}

export interface BookmarksPerPage {
  bookmark: { [id: string]: Bookmark };
  styles: { left: number, height: number, width: number };
}
