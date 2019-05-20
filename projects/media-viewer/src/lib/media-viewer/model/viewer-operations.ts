
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

export class StepZoomOperation {
  constructor(
    public readonly zoomFactor: number
  ) {}
}

export interface ZoomValue {
  value: number;
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

export class SetCurrentPageOperation {
  constructor(public pageNumber: number) {
  }
}

export class ChangePageByDeltaOperation {
  constructor(public delta: number) {
  }
}
