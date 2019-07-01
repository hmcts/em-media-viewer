import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ActionEvents } from './shared/action-events';
import { ToolbarButtonVisibilityService } from './toolbar/toolbar-button-visibility.service';
import { SetCurrentPageOperation } from './shared/viewer-operations';
import { AnnotationSet } from './annotations/annotation-set/annotation-set.model';

@Component({
  selector: 'mv-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['styles/main.scss']
})
export class MediaViewerComponent {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() contentType: string;
  @Input() actionEvents = new ActionEvents();
  @Input() showToolbar = true;
  @Input() showAnnotations = false;
  @Input() showCommentSummary: Subject<boolean>;
  @Input() commentSummaryToggle: Subject<SetCurrentPageOperation>;
  @Input() annotationSet: AnnotationSet;
  currentPageChanged = new Subject<SetCurrentPageOperation>();

  private supportedContentTypes = ['pdf', 'image'];

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService
  ) {}

  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }

}
