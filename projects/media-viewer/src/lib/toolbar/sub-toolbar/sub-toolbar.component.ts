import { Component, Input } from '@angular/core';
import { DownloadOperation, PrintOperation } from '../../shared/viewer-operations';
import { Subject } from 'rxjs';

@Component({
  selector: 'mv-sub-toolbar',
  templateUrl: './sub-toolbar.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class SubToolbarComponent {

  @Input() subToolbarHidden;
  @Input() printEvent: Subject<PrintOperation>;
  @Input() downloadEvent: Subject<DownloadOperation>;

  printFile() {
    this.printEvent.next(new PrintOperation());
  }

  downloadFile() {
    this.downloadEvent.next(new DownloadOperation());
  }
}
