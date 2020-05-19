import { Component } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar.module';

@Component({
  selector: 'mv-confirm-action',
  templateUrl: './confirm-action-dialog.component.html',
})
export class ConfirmActionDialogComponent {

  constructor(private toolbarEvents: ToolbarEventService) {}

  onCancel() {
    this.toolbarEvents.icp.leavingSession.next(false);
  }

  onConfirm() {
    this.toolbarEvents.icp.confirmExit();
    this.toolbarEvents.icp.leavingSession.next(false);
  }
}
