import { Component, Input } from '@angular/core';
import { ToolbarButtonToggles } from '../../model/toolbar-button-toggles';
import { DownloadOperation, PrintOperation } from '../../model/viewer-operations';
import { Subject } from 'rxjs';

@Component({
  selector: 'mv-tb-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class ToolbarRightPaneComponent {

  @Input() toolbarButtons: ToolbarButtonToggles;
  @Input() printEvent: Subject<PrintOperation>;
  @Input() downloadEvent: Subject<DownloadOperation>;

  constructor() {}

  toggleSecondaryToolbar() {
    this.toolbarButtons.subToolbarHidden.next(!this.toolbarButtons.subToolbarHidden.getValue());
  }

  printFile() {
    this.printEvent.next(new PrintOperation());
  }

  downloadFile() {
    this.downloadEvent.next(new DownloadOperation());
  }
}
