import { Component, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mv-tb-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrls: ['../toolbar.component.scss']
})
export class ToolbarViewerRightComponent {

  @Output() subToolbarToggle = new BehaviorSubject(true);

  constructor() {}

  toggleSecondaryToolbar() {
    this.subToolbarToggle.next(false);
  }

}
