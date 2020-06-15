import { AfterContentInit, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ViewerEventService } from '../../../viewers/viewer-event.service';
import { Subscription } from 'rxjs';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';

@Component({
  selector: 'mv-comment-set-toggle',
  templateUrl: './comment-set-toggle.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommentSetToggleComponent implements AfterContentInit, OnDestroy {

  showCommentsPanel: boolean;
  subscription: Subscription;

  constructor(
    private readonly viewerEvents: ViewerEventService,
    private readonly toolbarEvents: ToolbarEventService
  ) {
  }

  async ngAfterContentInit(): Promise<void> {
    this.subscription = this.viewerEvents.commentsPanelVisible.subscribe(toggle => this.showCommentsPanel = toggle);
    this.subscription.add(this.toolbarEvents.icp.enabled.subscribe(simplify => {
      if (simplify) { this.viewerEvents.toggleCommentsPanel(false); }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleCommentsPanel() {
    this.viewerEvents.toggleCommentsPanel(!this.showCommentsPanel);
  }
}
