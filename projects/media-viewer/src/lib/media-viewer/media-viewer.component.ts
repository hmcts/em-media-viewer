import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ActionEvents } from './model/action-events';
import {
  ImageViewerToolbarButtons,
  PdfViewerToolbarButtons,
  UnsupportedViewerToolbarButtons
} from './model/toolbar-button-toggles';
import { SetCurrentPageOperation } from './model/viewer-operations';

@Component({
  selector: 'mv-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['styles/main.scss']
})
export class MediaViewerComponent {

  @Input() url = '';
  @Input() downloadFileName = null;
  @Input() contentType: string;
  @Input() actionEvents = new ActionEvents();
  @Input() showToolbar = true;
  @Input() toolbarButtonToggles = new PdfViewerToolbarButtons();
  counter = 0;

  currentPageChanged = new Subject<SetCurrentPageOperation>();
  error: any;

  private supportedContentTypes = ['pdf', 'image'];

  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }

  getToolbarButtons() {
    if (this.contentType === 'pdf') {
      console.log('number of times this is called' + this.counter);
      this.counter++;
      return new PdfViewerToolbarButtons();
    } else if(this.contentType === 'image') {
      console.log('number of times this is called' + this.counter);
      this.counter++;
      return new ImageViewerToolbarButtons();
    } else {
      return new UnsupportedViewerToolbarButtons();
    }
  }
}
