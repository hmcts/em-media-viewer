import { Component, Input } from '@angular/core';
import { ToolbarBtnToggles, ToolbarToggles } from '../../model/toolbar-toggles';
import {
  ChangePageByDeltaOperation, DownloadOperation, PrintOperation,
  RotateOperation,
  SearchOperation,
  SearchResultsCount,
  SetCurrentPageOperation, StepZoomOperation,
  ZoomOperation, ZoomValue
} from '../../model/viewer-operations';
import { Subject } from 'rxjs';

@Component({
  selector: 'mv-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class MainToolbarComponent {

  @Input() toolbarToggles: ToolbarToggles;
  @Input() toolbarButtons: ToolbarBtnToggles;
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
