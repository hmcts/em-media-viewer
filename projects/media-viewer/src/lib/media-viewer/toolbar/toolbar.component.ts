import { Component, Input } from '@angular/core';
import {ActionEvents, SetCurrentPageOperation} from '../media-viewer.model';
import {BehaviorSubject, Subject} from 'rxjs';

@Component({
  selector: 'mv-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./styles/toolbar.component.scss']
})
export class ToolbarComponent {

  sidebarOpen = new BehaviorSubject(false);
  searchBarHidden = new BehaviorSubject(true);
  subToolbarHidden = new BehaviorSubject(true);
  @Input() currentPage: SetCurrentPageOperation;

  constructor() {}

  @Input() actionEvents: ActionEvents;
}
