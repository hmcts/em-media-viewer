import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { IcpParticipant, IcpState } from '../icp.interfaces';
import { select, Store } from '@ngrx/store';
import * as fromSelectors from '../../store/selectors/icp.selectors';

@Component({
  selector: 'mv-participants-list',
  templateUrl: './participants-list.component.html'
})
export class ParticipantsListComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  participants$: Observable<IcpParticipant[]>;
  presenter$: Observable<IcpParticipant>;
  isPresenter$: Observable<boolean>;

  showParticipantsList = false;

  constructor(private readonly toolbarEvents: ToolbarEventService,
              private store: Store<IcpState>) {}

  ngOnInit() {
    this.participants$ = this.store.pipe(select(fromSelectors.getParticipants));
    this.presenter$ = this.store.pipe(select(fromSelectors.getPresenter));
    this.isPresenter$ = this.store.pipe(select(fromSelectors.isPresenter));

    this.subscription = this.toolbarEvents.icp.participantsListVisible.subscribe(isVisible => this.showParticipantsList = isVisible);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
