import { Component, Input } from '@angular/core';
import { ToolbarButtonToggles } from '../../shared/toolbar-button-toggles';
import {
  ChangePageByDeltaOperation,
  DownloadOperation,
  PrintOperation,
  RotateOperation,
  SearchOperation,
  SearchResultsCount,
  SetCurrentPageOperation,
  StepZoomOperation,
  ZoomOperation,
  ZoomValue
} from '../../shared/viewer-operations';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mv-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class MainToolbarComponent {

  @Input() toolbarButtons: ToolbarButtonToggles;
  @Input() currentPage: SetCurrentPageOperation;
  @Input() searchEvent: Subject<SearchOperation>;
  @Input() searchResultsCountEvent: Subject<SearchResultsCount>;
  @Input() zoomEvent: Subject<ZoomOperation>;
  @Input() stepZoomEvent: Subject<StepZoomOperation>;
  @Input() zoomValueEvent: Subject<ZoomValue>;
  @Input() rotateEvent: Subject<RotateOperation>;
  @Input() changePageByDeltaEvent: Subject<ChangePageByDeltaOperation>;
  @Input() setCurrentPageEvent: Subject<SetCurrentPageOperation>;
  @Input() downloadEvent: Subject<DownloadOperation>;
  @Input() printEvent: Subject<PrintOperation>;
}
