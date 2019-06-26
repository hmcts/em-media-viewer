import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DownloadOperation } from '../../shared/viewer-operations';

@Component({
  selector: 'mv-unsupported-viewer',
  templateUrl: './unsupported-viewer.component.html',
  styleUrls: ['./unsupported-viewer.component.scss']
})
export class UnsupportedViewerComponent {

  @Input() url: string;
  @Input() originalUrl: string;
  @Input() downloadFileName: string;

  @ViewChild('downloadLink') downloadLink: ElementRef;

  @Input()
  set downloadOperation(operation: DownloadOperation) {
    if (operation) {
      this.downloadLink.nativeElement.click();
    }
  }
}
