import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ToolbarToggles } from '../../model/toolbar-toggles';
import { DownloadOperation } from '../../model/viewer-operations';

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
  set toolbarToggles(toolbarToggles: ToolbarToggles | null) {
    if (toolbarToggles) {
      toolbarToggles.showDownloadBtn.next(true);
    }
  }

  @Input()
  set downloadOperation(operation: DownloadOperation) {
    if (operation) {
      this.downloadLink.nativeElement.click();
    }
  }
}
