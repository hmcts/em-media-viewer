import { Component, Input } from '@angular/core';
import { ToolbarBtnToggles, ToolbarToggles } from '../../model/toolbar-toggles';
import { DownloadOperation, PrintOperation } from '../../model/viewer-operations';
import { Subject } from 'rxjs';

@Component({
  selector: 'mv-tb-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class ToolbarRightPaneComponent {

  @Input() toolbarToggles: ToolbarToggles;
  @Input() toolbarButtons: ToolbarBtnToggles;
  @Input() printEvent: Subject<PrintOperation>;
  @Input() downloadEvent: Subject<DownloadOperation>;

  constructor() {}

  toggleSecondaryToolbar() {
    this.toolbarToggles.subToolbarHidden.next(!this.toolbarToggles.subToolbarHidden.getValue());
  }

  printFile() {
    this.printEvent.next(new PrintOperation());
  }

  downloadFile() {
    this.downloadEvent.next(new DownloadOperation());
  }
}
