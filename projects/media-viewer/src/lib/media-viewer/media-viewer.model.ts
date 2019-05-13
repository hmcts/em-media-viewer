import { Subject } from 'rxjs';

export class ActionEvents {
  rotate: Subject<RotateOperation>;
  search: Subject<SearchOperation>;
  zoom: Subject<ZoomOperation>;
  print: Subject<PrintOperation>;
  download: Subject<DownloadOperation>;

  constructor() {
    this.rotate = new Subject<RotateOperation>();
    this.search = new Subject<SearchOperation>();
    this.zoom = new Subject<ZoomOperation>();
    this.print = new Subject<PrintOperation>();
    this.download = new Subject<DownloadOperation>();
  }
}

export class DownloadOperation {
}

export class PrintOperation {
}

export class RotateOperation {

  rotation: number;

  constructor(rotation: number) {
    this.rotation = rotation;
  }
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

