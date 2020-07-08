import { Rectangle } from '../../annotations/annotation-set/annotation-view/rectangle/rectangle.model';

export interface Redaction {
  redactionId?: string;
  documentId?: string;
  page?: number;
  rectangles?: Rectangle[];
}
