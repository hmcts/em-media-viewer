import { Injectable } from '@angular/core';
import { ToolbarEventService } from '../toolbar/toolbar-event.service';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IcpUpdateService } from './icp-update.service';
import { ViewerEventService } from '../viewers/viewer-event.service';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { IcpState, IcpSession } from './icp.interfaces';
import * as fromDocSelectors from '../store/selectors/document.selectors';

@Injectable({ providedIn: 'root' })
export class IcpFollowerService {

  session: IcpSession;
  private previousRotation: number|null = null;
  $subscription: Subscription;

  constructor(private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    private readonly socketService: IcpUpdateService,
    private store: Store<IcpState>) { }


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
      this.viewerEvents.goToDestinationICP([
        pdfPosition.pageNumber - 1,
        { 'name': 'XYZ' },
        pdfPosition.left,
        pdfPosition.top
      ]);
    }
    this.store.pipe(
      select(fromDocSelectors.getPdfPosition), 
      take(1), 
      distinctUntilChanged(undefined, a => a.rotation))
      .subscribe(position => {
        if (this.previousRotation === pdfPosition.rotation) {
          return;
        }
        const rotationDelta = (pdfPosition.rotation - position.rotation) % 360;
        if (rotationDelta && rotationDelta !== 0) {
          this.toolbarEvents.rotate(rotationDelta);
        }
      });
  }
}
