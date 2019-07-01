import { Component, Input } from '@angular/core';
import { DownloadOperation, PrintOperation } from '../../../shared/viewer-operations';
import { Subject } from 'rxjs';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';

@Component({
  selector: 'mv-tb-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrls: ['../../../styles/main.scss']
})
export class ToolbarRightPaneComponent {

  @Input() printEvent: Subject<PrintOperation>;
  @Input() downloadEvent: Subject<DownloadOperation>;

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService
  ) {}

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
