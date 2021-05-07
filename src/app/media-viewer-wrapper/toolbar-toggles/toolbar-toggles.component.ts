import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-toolbar-toggles',
  templateUrl: './toolbar-toggles.component.html',
  styleUrls: ['./toolbar-toggles.component.scss']
})
export class ToolbarTogglesComponent {

  @Input() showToolbar: boolean;
  @Input() showCustomToolbar: boolean;

  @Output() toggleToolbar = new BehaviorSubject(true);
  @Output() toggleToolbarBtns = new EventEmitter();
  @Output() toggleCustomToolbar = new BehaviorSubject(false);
  @Output() toggleAnnotations = new BehaviorSubject(true);
  @Output() toggleRedaction = new BehaviorSubject(true);
  @Output() toggleICP = new BehaviorSubject(true);
  @Output() toggleAudioPlayer = new BehaviorSubject(true);
  @Output() showCommentSummary = new BehaviorSubject(false);

  toolbarButtonOverrides = {};

  toggleButtonOverrides(key: string, value: boolean) {
    this.toolbarButtonOverrides[key] = value;
    this.toggleToolbarBtns.emit(this.toolbarButtonOverrides);
  }

  setCustomToolbar(checked: boolean) {
    this.toggleCustomToolbar.next(checked);
    if (checked) {
      this.toggleToolbar.next(!checked);
    }
  }
}
