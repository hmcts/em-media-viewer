import { Component } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { IcpEventService } from '../../toolbar/icp-event.service';

@Component({
  selector: 'mv-confirm-action',
  templateUrl: './confirm-action-dialog.component.html',
})
export class ConfirmActionDialogComponent {

  constructor(private icpEventService: IcpEventService) {}

  onCancel() {
    this.icpEventService.leavingSession.next(false);
  }

  onConfirm() {
    this.icpEventService.confirmExit();
    this.icpEventService.leavingSession.next(false);
  }
}
