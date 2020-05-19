import { Injectable } from '@angular/core';
import { ToolbarEventService } from '../toolbar/toolbar-event.service';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../store/reducers/reducers';
import { IcpSession } from '../store/reducers/reducers';
import { Subscription } from 'rxjs';
import { IcpUpdateService } from './icp-update.service';
import { ViewerEventService } from '../viewers/viewer-event.service';
import * as fromDocSelectors from '../store/selectors/document.selectors';
import { take } from 'rxjs/operators';

@Injectable()
export class IcpFollowerService {

  session: IcpSession;

  $subscription: Subscription;

  constructor(private readonly toolbarEvents: ToolbarEventService,
              private readonly viewerEvents: ViewerEventService,
              private readonly socketService: IcpUpdateService,
              private store: Store<fromStore.IcpState>) {}


  update(isFollower: boolean) {
    if (isFollower) {
      this.subscribe();
    } else {
      this.unsubscribe();
    }
  }

  subscribe() {
    if (!this.$subscription) {
      this.$subscription = this.socketService.screenUpdated()
        .subscribe(screen => this.followScreenUpdate(screen));
    }
  }

  unsubscribe() {
    if (this.$subscription) {
      this.$subscription.unsubscribe();
      this.$subscription = undefined;
    }
  }

  followScreenUpdate({ pdfPosition }) {
    if (pdfPosition) {
      this.viewerEvents.goToDestination([
        pdfPosition.pageNumber - 1,
        { 'name': 'XYZ' },
        pdfPosition.left,
        pdfPosition.top
      ]);
    }
    this.store.pipe(select(fromDocSelectors.getPdfPosition), take(1))
      .subscribe(position => {
        const rotationDelta =  (pdfPosition.rotation - position.rotation)%360;
        if (rotationDelta !== 0) {
          this.toolbarEvents.rotate(rotationDelta);
        }
      });
  }
}
