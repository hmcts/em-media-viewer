import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-toolbar-toggles',
  templateUrl: './toolbar-toggles.component.html',
  styleUrls: ['./toolbar-toggles.component.scss']
})
export class ToolbarTogglesComponent {

  @Input() showCommentSummary: Subject<boolean>;
  @Input() showToolbar: boolean;
  @Input() showCustomToolbar: boolean;

  @Output() toggleToolbar = new BehaviorSubject(true);
  @Output() toggleToolbarBtns = new EventEmitter();
  @Output() toggleCustomToolbar = new BehaviorSubject(false);
  @Output() toggleAnnotations = new BehaviorSubject(true);

  toolbarButtonOverrides = {};

  toggleButtonOverrides(key: string, value: boolean) {
    this.toolbarButtonOverrides[key] = value;
    this.toggleToolbarBtns.emit(this.toolbarButtonOverrides);
  }
}
