import { Injectable } from '@angular/core';
import { ToolbarEventService } from '../toolbar/toolbar-event.service';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../store/reducers/reducers';
import { IcpScreenUpdate, IcpSession } from '../store/reducers/reducers';
import * as fromDocSelectors from '../store/selectors/document.selectors';
import { Subscription } from 'rxjs';
import { PdfPosition } from '../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';
import { IcpUpdateService } from './icp-update.service';

@Injectable()
export class IcpPresenterService {

  session: IcpSession;

  $subscription: Subscription;

  constructor(private readonly toolbarEvents: ToolbarEventService,
              private readonly socketService: IcpUpdateService,
              private store: Store<fromStore.IcpState>) {}


  update(isPresenter: boolean) {
    if (isPresenter) {
      this.subscribe();
    } else {
      this.unsubscribe();
    }
  }

  subscribe() {
    if (!this.$subscription) {
      this.$subscription = this.store.pipe(select(fromDocSelectors.getPdfPosition))
        .subscribe(pdfPosition => this.onPositionUpdate(pdfPosition));
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
}
