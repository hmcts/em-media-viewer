import { Component, Input } from '@angular/core';
import { DownloadOperation, PrintOperation } from '../../../shared/viewer-operations';
import { Subject } from 'rxjs';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';

@Component({
  selector: 'mv-sub-toolbar',
  templateUrl: './sub-toolbar.component.html',
  styleUrls: ['../../../styles/main.scss']
})
export class SubToolbarComponent {

  @Input() printEvent: Subject<PrintOperation>;
  @Input() downloadEvent: Subject<DownloadOperation>;

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService
  ) {}

  printFile() {
    this.printEvent.next(new PrintOperation());
  }

  downloadFile() {
    this.downloadEvent.next(new DownloadOperation());
  }
}
