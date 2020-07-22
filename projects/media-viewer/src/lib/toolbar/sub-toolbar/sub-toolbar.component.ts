import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { ToolbarEventService } from '../toolbar-event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mv-sub-toolbar',
  templateUrl: './sub-toolbar.component.html'
})
export class SubToolbarComponent implements OnInit, OnDestroy {

  icpEnabled = false;

  subscription: Subscription;

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    public readonly toolbarEvents: ToolbarEventService
  ) {}

  ngOnInit() {
    this.subscription = this.toolbarEvents.icp.enabled.subscribe(enabled => {
      this.icpEnabled = enabled;
      if (this.icpEnabled) { this.toolbarEvents.subToolbarHidden.next(true); }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onClickHighlightToggle() {
    this.toolbarEvents.toggleHighlightMode();
    this.closeMenu();
  }

  onClickDrawToggle() {
    this.toolbarEvents.toggleDrawMode();
    this.closeMenu();
  }

  printFile() {
    this.toolbarEvents.print();
    this.closeMenu();
  }

  downloadFile() {
    this.toolbarEvents.download();
    this.closeMenu();
  }

  enterIcpMode() {
    this.toolbarEvents.icp.enable();
  }

  rotateCcw() {
    this.toolbarEvents.rotate(270);
    this.closeMenu();
  }

  rotateCw() {
    this.toolbarEvents.rotate(90);
    this.closeMenu();
  }

  grabNDrag() {
    this.toolbarEvents.toggleGrabNDrag();
    this.closeMenu();
  }

  saveRotation() {
    this.toolbarButtons.showSaveRotationButton = false;
    this.toolbarEvents.saveRotation()
    this.closeMenu();
  }

  closeMenu() {
    this.toolbarEvents.subToolbarHidden.next(true);
  }
}
