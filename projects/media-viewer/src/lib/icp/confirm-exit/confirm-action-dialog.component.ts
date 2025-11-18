import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IcpEventService } from '../../toolbar/icp-event.service';

@Component({
    selector: 'mv-confirm-action',
    templateUrl: './confirm-action-dialog.component.html',
    standalone: false
})
export class ConfirmActionDialogComponent implements AfterViewInit {
  @ViewChild('modalContainer') modalContainer: ElementRef;

  constructor(private icpEventService: IcpEventService) {}

  ngAfterViewInit(): void {
    if (this.modalContainer) {
      this.modalContainer.nativeElement.focus();
    }
  }

  onCancel() {
    this.icpEventService.leavingSession.next(false);
  }

  onConfirm() {
    this.icpEventService.confirmExit();
    this.icpEventService.leavingSession.next(false);
  }
}
