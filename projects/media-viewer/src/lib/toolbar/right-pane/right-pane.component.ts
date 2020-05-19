import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { ToolbarEventService } from '../toolbar-event.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'mv-tb-right-pane',
  templateUrl: './right-pane.component.html',
})
export class ToolbarRightPaneComponent implements OnInit, OnDestroy {

  @Input() enableAnnotations = false;
  @Input() enableRedaction = false;
  @Input() enableICP = false;

  icpSimplifiedToolbar = false;

  subscription: Subscription;

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    public readonly toolbarEvents: ToolbarEventService
  ) {}

  ngOnInit() {
    this.subscription = this.toolbarEvents.icp.enabled.subscribe(simplify => {
      this.icpSimplifiedToolbar = simplify;
      if (this.icpSimplifiedToolbar) { this.toolbarEvents.subToolbarHidden.next(true); }
    });
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
}
