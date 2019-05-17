import { Component, Input } from '@angular/core';
import { ToolbarToggles } from '../../model/toolbar-toggles';
import { SetCurrentPageOperation } from '../../model/viewer-operations';
import { ActionEvents } from '../../model/action-events';

@Component({
  selector: 'mv-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class MainToolbarComponent {

  @Input() toolbarToggles: ToolbarToggles;
  @Input() currentPage: SetCurrentPageOperation;
  @Input() actionEvents: ActionEvents;
}
