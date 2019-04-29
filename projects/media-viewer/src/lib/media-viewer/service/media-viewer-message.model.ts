
export class MediaViewerMessage {

}

export class RotateOperation extends MediaViewerMessage {

  direction: RotateDirection;

  constructor(direction: RotateDirection) {
    super();
    this.direction = direction;
  }
}

export enum RotateDirection {
  LEFT, RIGHT
}

export class ZoomOperation extends MediaViewerMessage {

  zoomFactor: number;

  constructor(zoomFactor: number) {
    super();
    this.zoomFactor = zoomFactor;
  }
}

export class SearchOperation extends MediaViewerMessage {

  searchTerm: string;
  previous: boolean

  constructor(searchTerm: string, previous?: boolean) {
    super();
    this.searchTerm = searchTerm;
    this.previous = previous;
  }
}

