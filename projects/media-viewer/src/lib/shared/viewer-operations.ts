/**
 * @deprecated Please DO NOT ADD to this file
 * Instead please add new Operations to viewer-events.service.ts
 */
export class DownloadOperation {}
/**
 * @deprecated Please DO NOT ADD to this file
 * Instead please add new Operations to viewer-events.service.ts
 */
export class PrintOperation {}
/**
 * @deprecated Please DO NOT ADD to this file
 * Instead please add new Operations to viewer-events.service.ts
 */
export class RotateOperation {
  constructor(
    public readonly rotation: number
  ) {}
}
/**
 * @deprecated Please DO NOT ADD to this file
 * Instead please add new Operations to viewer-events.service.ts
 */
export class ZoomOperation {
  constructor(
    public readonly zoomFactor: number
  ) {}
}
/**
 * @deprecated Please DO NOT ADD to this file
 * Instead please add new Operations to viewer-events.service.ts
 */
export class StepZoomOperation {
  constructor(
    public readonly zoomFactor: number
  ) {}
}
/**
 * @deprecated Please DO NOT ADD to this file
 * Instead please add new Operations to viewer-events.service.ts
 */
export interface ZoomValue {
  value: number;
}
/**
 * @deprecated Please DO NOT ADD to this file
 * Instead please add new Operations to viewer-events.service.ts
 */
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
/**
 * @deprecated Please DO NOT ADD to this file
 * Instead please add new Operations to viewer-events.service.ts
 */
export interface SearchResultsCount {
  current: number;
  total: number;
}
/**
 * @deprecated Please DO NOT ADD to this file
 * Instead please add new Operations to viewer-events.service.ts
 */
export class SetCurrentPageOperation {
  constructor(public pageNumber: number) {
  }
}
/**
 * @deprecated Please DO NOT ADD to this file
 * Instead please add new Operations to viewer-events.service.ts
 */
export class ChangePageByDeltaOperation {
  constructor(public delta: number) {
  }
}
/**
 * @deprecated Please DO NOT ADD to this file
 * Instead please add new Operations to viewer-events.service.ts
 */
export class NewDocumentLoadInit {
  constructor(public documentUrl: string) {
  }
}
/**
 * @deprecated Please DO NOT ADD to this file
 * Instead please add new Operations to viewer-events.service.ts
 */
export class DocumentLoadProgress {
  constructor(public loaded: number, public total: number) {
  }
}
/**
 * @deprecated Please DO NOT ADD to this file
 * Instead please add new Operations to viewer-events.service.ts
 */
export class DocumentLoaded {
  constructor(public document: any) {
  }
}
/**
 * @deprecated Please DO NOT ADD to this file
 * Instead please add new Operations to viewer-events.service.ts
 */
export class DocumentLoadFailed {
  constructor() {
  }
}
