import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToolbarButtonToggles } from '../../../../projects/media-viewer/src/lib/events/toolbar-button-toggles';

@Component({
  selector: 'app-toolbar-toggles',
  templateUrl: './toolbar-toggles.component.html',
  styleUrls: ['./toolbar-toggles.component.scss']
})
export class ToolbarTogglesComponent {
  @Input() toolbarButtons: ToolbarButtonToggles;
  @Output() toggleToolbarVisibility = new BehaviorSubject(true);
  @Input() showCommentSummary: Subject<boolean>;
}
