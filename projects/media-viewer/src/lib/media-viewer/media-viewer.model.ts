import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export class ActionEvents {
  public readonly rotate = new Subject<RotateOperation>();
  public readonly search = new Subject<SearchOperation>().pipe(debounceTime(250));
  public readonly searchResultsCount = new Subject<SearchResultsCount>();
  public readonly zoom = new Subject<ZoomOperation>();
  public readonly print = new Subject<PrintOperation>();
  public readonly download = new Subject<DownloadOperation>();
  public readonly changePage = new Subject<ChangePageOperation>();
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
    public readonly highlightAll: boolean,
    public readonly matchCase: boolean,
    public readonly wholeWord: boolean,
    public readonly previous: boolean,
    public readonly reset: boolean
  ) {}
}

export interface SearchResultsCount {
  current: number;
  total: number;
}

export class ChangePageOperation {
  constructor(public changePageParameter: ChangePageParameter) {
  }
}

export class ChangePageParameter {
}

export class SetCurrentPage extends ChangePageParameter {
  constructor(public pageNumber: number) {
    super();
  }
}

export class ChangeByDelta extends ChangePageParameter {
  constructor(public delta: number) {
    super();
  }
}
