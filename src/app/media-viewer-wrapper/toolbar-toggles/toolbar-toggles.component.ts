import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToolbarButtonVisibilityService } from '../../../../projects/media-viewer/src/lib/toolbar/toolbar-button-visibility.service';

@Component({
  selector: 'app-toolbar-toggles',
  templateUrl: './toolbar-toggles.component.html',
  styleUrls: ['./toolbar-toggles.component.scss']
})
export class ToolbarTogglesComponent {
  @Output() toggleToolbar = new BehaviorSubject(true);
  @Output() toggleAnnotations = new BehaviorSubject(true);
  @Input() showCommentSummary: Subject<boolean>;

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService
  ) {}
}
