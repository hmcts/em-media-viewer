import { Subject } from 'rxjs';

export class ActionEvents {
  public readonly rotate = new Subject<RotateOperation>();
  public readonly search = new Subject<SearchOperation>();
  public readonly zoom = new Subject<ZoomOperation>();
  public readonly print = new Subject<PrintOperation>();
  public readonly download = new Subject<DownloadOperation>();
}

export class DownloadOperation {}

export class PrintOperation {}

export class RotateOperation {
  constructor(
    public readonly rotation: number
  ) {}
}

export class ZoomOperation {
  constructor(
    public readonly zoomFactor: number
  ) {}
}

export class SearchOperation {
  constructor(
    public readonly searchTerm: string,
    public readonly previous: boolean,
    public readonly reset: boolean
  ) {}
}

