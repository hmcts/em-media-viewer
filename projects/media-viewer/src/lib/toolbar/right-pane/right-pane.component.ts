import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { ToolbarEventService } from '../toolbar-event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mv-tb-right-pane',
  templateUrl: './right-pane.component.html',
})
export class ToolbarRightPaneComponent implements OnInit, OnDestroy {

  @Input() enableAnnotations = true;
  @Input() enableRedaction = false;
  @Input() enableICP = false;

  icpEnabled = false;
  showCommentsPanel: boolean;
  subscription: Subscription;

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    public readonly toolbarEvents: ToolbarEventService
  ) {}

  ngOnInit() {
    this.subscription = this.toolbarEvents.icp.enabled.subscribe(enabled => {
      this.icpEnabled = enabled;
      this.toolbarEvents.toggleCommentsPanel(!enabled);
      if (this.icpEnabled) {
        this.toolbarEvents.subToolbarHidden.next(true);
      }
    });
    this.subscription.add(this.toolbarEvents.commentsPanelVisible.subscribe(toggle => this.showCommentsPanel = toggle));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleSecondaryToolbar() {
    this.toolbarEvents.subToolbarHidden.next(!this.toolbarEvents.subToolbarHidden.getValue());
  }

  printFile() {
    this.toolbarEvents.print();
  }

  downloadFile() {
    this.toolbarEvents.download();
  }

  toggleRedactionMode() {
    this.toolbarEvents.toggleRedactionMode();
  }

  enterIcpMode() {
    this.toolbarEvents.icp.enable();
  }

  toggleCommentsPanel() {
    this.toolbarEvents.toggleCommentsPanel(!this.showCommentsPanel);
  }

}
