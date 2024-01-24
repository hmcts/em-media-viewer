import { Rectangle } from '../../annotations/annotation-set/annotation-view/rectangle/rectangle.model';

export interface RedactionSearch {
  page?: number;
  matchedIndex?: number;
  matchesCount?: number;
  isPrevious: boolean;
}

export interface RedactRectangle {
  page?: number;
  matchedIndex?: number;
  rectangles?: Rectangle[];
}
