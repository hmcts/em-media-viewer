import {Component, OnInit} from '@angular/core';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { ToolbarEventService } from '../toolbar-event.service';
import { Observable } from 'rxjs';
import { IcpSession } from '../../store/reducers/icp.reducer';
import { select, Store } from '@ngrx/store';
import * as fromReducers from '../../store/reducers/icp.reducer';
import * as fromSelectors from '../../store/selectors/icp.selectors';

@Component({
  selector: 'mv-sub-toolbar',
  templateUrl: './sub-toolbar.component.html'
})
export class SubToolbarComponent implements OnInit {

  icpSession$: Observable<IcpSession>;

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    public readonly toolbarEvents: ToolbarEventService,
    private store: Store<fromReducers.IcpState>
  ) {}

  ngOnInit() {
    this.icpSession$ = this.store.pipe(select(fromSelectors.getIcpSession));
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

  launchIcpSession() {
    this.toolbarEvents.icp.launchSession();
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

  closeMenu() {
    this.toolbarEvents.subToolbarHidden.next(true);
  }
}
