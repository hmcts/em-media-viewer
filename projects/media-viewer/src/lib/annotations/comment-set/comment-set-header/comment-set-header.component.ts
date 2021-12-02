import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Annotation } from '../../annotation-set/annotation-view/annotation.model';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../../store/reducers/reducers';
import * as fromTagSelectors from '../../../store/selectors/tag.selectors';
import * as fromAnnoSelector from '../../../store/selectors/annotation.selectors';
import { combineLatest, Subscription } from 'rxjs';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';

@Component({
  selector: 'mv-comment-set-header',
  templateUrl: './comment-set-header.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommentSetHeaderComponent implements OnInit, OnDestroy {

  @Input() public showCommentSummary: boolean;
  @Output() public readonly showCommentSummaryDialog = new EventEmitter();

  tabs: {isFiltered?: boolean; label: string}[] = [];
  tabSelected = '';
  isFiltered: boolean;
  navigationList: Annotation[];
  $subscriptions: Subscription;

  constructor(private store: Store<fromStore.State>,
              public toolbarEvents: ToolbarEventService) {}

  ngOnInit(): void {
    const tagFilter$ = this.store.pipe(select(fromTagSelectors.getTagFilters));
    const filteredAnnotation$ = this.store.pipe(select(fromAnnoSelector.getFilteredAnnotations));

    this.$subscriptions = combineLatest([tagFilter$, filteredAnnotation$]).subscribe(([formData, filteredAnno]) => {
      this.navigationList = filteredAnno;
      this.tabs = this.navigationList.length > 0 ?
        [{label: 'comments'}, {label: 'filter'}, {label: 'search'}] : [{label: 'comments'}];
      this.isFiltered = !formData.length;
      this.tabs = [...this.tabs].map((tab) => {
        return !this.isFiltered && tab.label === 'filter' ? {...tab, isFiltered: true} : {...tab, isFiltered: false};
      });
    });
  }

  public toggleCommentsSummary(): void {
    this.showCommentSummaryDialog.emit();
  }

  selectTab(tab: string) {
    this.tabSelected = tab !== this.tabSelected ? tab : undefined;
  }

  ngOnDestroy(): void {
    this.$subscriptions.unsubscribe();
  }
}
