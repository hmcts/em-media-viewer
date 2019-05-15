import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export class ActionEvents {
  public readonly rotate = new Subject<RotateOperation>();
  public readonly search = new Subject<SearchOperation>().pipe(debounceTime(250));
  public readonly searchResultsCount = new Subject<SearchResultsCount>();
  public readonly zoom = new Subject<ZoomOperation>();
  public readonly print = new Subject<PrintOperation>();
  public readonly download = new Subject<DownloadOperation>();
}

export class ToolbarToggles {
  public readonly subToolbarHidden = new BehaviorSubject(true);
  public readonly sidebarOpen = new BehaviorSubject(false);
  public readonly searchBarHidden = new BehaviorSubject(true);
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
