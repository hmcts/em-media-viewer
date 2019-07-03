import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-toolbar-toggles',
  templateUrl: './toolbar-toggles.component.html',
  styleUrls: ['./toolbar-toggles.component.scss']
})
export class ToolbarTogglesComponent {
  @Output() toggleToolbar = new BehaviorSubject(true);
  @Output() toggleAnnotations = new BehaviorSubject(true);
  @Input() showCommentSummary: Subject<boolean>;
}
