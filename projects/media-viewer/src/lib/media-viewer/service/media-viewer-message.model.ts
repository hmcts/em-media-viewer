import { Subject } from 'rxjs';

export interface ActionEvents {
  rotate: Subject<RotateOperation>,
  search: Subject<SearchOperation>,
  zoom: Subject<ZoomOperation>
}

export class RotateOperation {

  direction: RotateDirection;

  constructor(direction: RotateDirection) {
    this.direction = direction;
  }
}

export enum RotateDirection {
  LEFT, RIGHT
}

export class ZoomOperation {

  zoomFactor: number;

  constructor(zoomFactor: number) {
    this.zoomFactor = zoomFactor;
  }
}

export class SearchOperation {

  searchTerm: string;
  previous: boolean;

  constructor(searchTerm: string, previous?: boolean) {
    this.searchTerm = searchTerm;
    this.previous = previous;
  }
}

