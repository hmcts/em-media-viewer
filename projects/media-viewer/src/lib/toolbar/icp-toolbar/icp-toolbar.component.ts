import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToolbarEventService } from '../toolbar-event.service';
import { select, Store } from '@ngrx/store';
import * as fromIcpSelectors from '../../store/selectors/icp.selectors';
import { Subscription } from 'rxjs';
import { IcpState } from '../../icp/icp.interfaces';

@Component({
  selector: 'mv-icp-toolbar',
  templateUrl: './icp-toolbar.component.html'
})
export class IcpToolbarComponent implements OnInit, OnDestroy {

  presenterName: string;
  isPresenter: boolean;

  private $subscription: Subscription;

  constructor(public readonly toolbarEventService: ToolbarEventService,
              private store: Store<IcpState>) {}

  ngOnInit() {
    this.$subscription = this.store.pipe(select(fromIcpSelectors.isPresenter))
      .subscribe(isPresenter => this.isPresenter = isPresenter);
    this.$subscription.add(this.store.pipe(select(fromIcpSelectors.getPresenterName))
      .subscribe(name => this.presenterName = name));
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  present() {
    this.toolbarEventService.icp.becomePresenter();
  }

  stopPresenting() {
    this.toolbarEventService.icp.stopPresenting();
  }

  leaveIcpSession() {
    this.toolbarEventService.icp.leaveSession();
  }
}
