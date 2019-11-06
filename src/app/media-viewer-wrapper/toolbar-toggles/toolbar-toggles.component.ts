import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-toolbar-toggles',
  templateUrl: './toolbar-toggles.component.html',
  styleUrls: ['./toolbar-toggles.component.scss']
})
export class ToolbarTogglesComponent {

  @Input() showCommentSummary: Subject<boolean>;

  @Output() toggleToolbar = new BehaviorSubject(true);
  @Output() toggleToolbarBtns = new EventEmitter();
  @Output() toggleAnnotations = new BehaviorSubject(true);

  toolbarButtonOverrides = {};

  toggleButtonOverrides(key: string, value: boolean) {
    this.toolbarButtonOverrides[key] = value;
    this.toggleToolbarBtns.emit(this.toolbarButtonOverrides);
  }
}
