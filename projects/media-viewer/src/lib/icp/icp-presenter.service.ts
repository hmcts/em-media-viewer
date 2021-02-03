import { Injectable } from '@angular/core';
import { ToolbarEventService } from '../toolbar/toolbar-event.service';
import { select, Store } from '@ngrx/store';
import * as fromDocSelectors from '../store/selectors/document.selectors';
import { Subscription } from 'rxjs';
import { IcpUpdateService } from './icp-update.service';
import { IcpState, IcpScreenUpdate, IcpSession, IcpParticipant } from './icp.interfaces';
import * as fromIcpSelectors from '../store/selectors/icp.selectors';
import { PdfPosition } from "../store/reducers/document.reducer";

@Injectable()
export class IcpPresenterService {

  session: IcpSession;
  presenter: IcpParticipant;
  pdfPosition: PdfPosition;

  $subscription: Subscription;

  constructor(private readonly toolbarEvents: ToolbarEventService,
              private readonly socketService: IcpUpdateService,
              private store: Store<IcpState>) {}

  update(isPresenter: boolean) {
    if (isPresenter) {
      this.subscribe();
    } else {
      this.unsubscribe();
    }
  }

  subscribe() {
    if (!this.$subscription) {
      this.$subscription = this.store.pipe(select(fromDocSelectors.getPdfPosition)).subscribe(pdfPosition => {
          this.pdfPosition = pdfPosition;
          this.onPositionUpdate(pdfPosition);
        });
      this.$subscription.add(this.store.pipe(select(fromIcpSelectors.getPresenter)).subscribe(presenter => {
        this.presenter = presenter;
      }));
      this.$subscription.add(this.socketService.newParticipantJoined().subscribe(() => this.onNewParticipantJoined()));
    }
  }

  unsubscribe() {
    if (this.$subscription) {
      this.$subscription.unsubscribe();
      this.$subscription = undefined;
    }
  }

  onPositionUpdate(pdfPosition: PdfPosition) {
    const screen: IcpScreenUpdate = { pdfPosition, document: undefined };
    this.socketService.updateScreen(screen);
  }

  onNewParticipantJoined() {
    this.onPositionUpdate(this.pdfPosition);
    this.socketService.updatePresenter(this.presenter);
  }
}
