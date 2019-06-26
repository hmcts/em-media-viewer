import { Component, Input } from '@angular/core';
import { DownloadOperation, PrintOperation } from '../../shared/viewer-operations';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'mv-tb-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class ToolbarRightPaneComponent {

  @Input() printEvent: Subject<PrintOperation>;
  @Input() downloadEvent: Subject<DownloadOperation>;
  @Input() subToolbarHidden: BehaviorSubject<boolean>;
  @Input() showPresentationModeBtn: boolean;
  @Input() showOpenFileBtn: boolean;
  @Input() showDownloadBtn: boolean;
  @Input() showPrintBtn: boolean;
  @Input() showBookmarkBtn: boolean;
  @Input() showSubToolbarToggleBtn: boolean;

  constructor() {}

  toggleSecondaryToolbar() {
    this.subToolbarHidden.next(!this.subToolbarHidden.getValue());
  }

  printFile() {
    this.printEvent.next(new PrintOperation());
  }

  downloadFile() {
    this.downloadEvent.next(new DownloadOperation());
  }
}
