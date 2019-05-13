import { Component, Input } from '@angular/core';
import { ActionEvents } from '../media-viewer.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mv-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./styles/toolbar.component.scss']
})
export class ToolbarComponent {

  sidebarOpen = new BehaviorSubject(false);
  searchbarHidden = new BehaviorSubject(true);
  subToolbarHidden = new BehaviorSubject(true);

  constructor() {}

  @Input() actionEvents: ActionEvents;
}
