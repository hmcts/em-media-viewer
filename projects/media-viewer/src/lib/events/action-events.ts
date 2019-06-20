import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  ChangePageByDeltaOperation,
  DownloadOperation,
  PrintOperation,
  RotateOperation,
  SearchOperation,
  SearchResultsCount,
  SetCurrentPageOperation,
  StepZoomOperation,
  ToggleHighlightModeOperation,
  ZoomOperation,
  ZoomValue
} from './viewer-operations';

export class ActionEvents {
  public readonly rotate = new Subject<RotateOperation>();
  public readonly search = new Subject<SearchOperation>().pipe(debounceTime(250));
  public readonly searchResultsCount = new Subject<SearchResultsCount>();
  public readonly zoom = new Subject<ZoomOperation>();
  public readonly stepZoom = new Subject<StepZoomOperation>();
  public readonly zoomValue = new BehaviorSubject<ZoomValue>({ value: 1 });
  public readonly print = new Subject<PrintOperation>();
  public readonly download = new Subject<DownloadOperation>();
  public readonly setCurrentPage = new Subject<SetCurrentPageOperation>();
  public readonly changePageByDelta = new Subject<ChangePageByDeltaOperation>();
  public readonly toggleHighlightMode = new Subject<ToggleHighlightModeOperation>();
}
