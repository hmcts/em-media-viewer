import { Component } from '@angular/core';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';
import { ToolbarEventService } from '../../toolbar-event.service';

@Component({
  selector: 'mv-sub-toolbar',
  templateUrl: './sub-toolbar.component.html',
  styleUrls: ['../../../styles/main.scss']
})
export class SubToolbarComponent {

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    public readonly toolbarEvents: ToolbarEventService
  ) {}

  printFile() {
    this.toolbarEvents.print.next();
  }

  downloadFile() {
    this.toolbarEvents.download.next();
  }

}
