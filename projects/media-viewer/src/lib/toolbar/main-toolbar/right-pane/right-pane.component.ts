import {Component, Input} from '@angular/core';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';
import { ToolbarEventService } from '../../toolbar-event.service';

@Component({
  selector: 'mv-tb-right-pane',
  templateUrl: './right-pane.component.html',
})
export class ToolbarRightPaneComponent {
  @Input() enableAnnotations = false;

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    public readonly toolbarEvents: ToolbarEventService
  ) {}

  toggleSecondaryToolbar() {
    this.toolbarButtons.subToolbarHidden.next(!this.toolbarButtons.subToolbarHidden.getValue());
  }

  printFile() {
    this.toolbarEvents.print();
  }

  downloadFile() {
    this.toolbarEvents.download();
  }

  onToggleReduceBar() {
    this.toolbarEvents.toggleReduceBar();
  }


}
