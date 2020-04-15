import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';
import { Annotation } from '../../annotation-set/annotation-view/annotation.model';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../../store/reducers';
import * as fromTagSelectors from '../../../store/selectors/tags.selectors';
import * as fromAnnoSelector from '../../../store/selectors/annotatioins.selectors';

@Component({
  selector: 'mv-comment-set-header',
  templateUrl: './comment-set-header.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommentSetHeaderComponent implements OnInit {

  @Input() public showCommentSummary: boolean;
  @Output() public readonly showCommentSummaryDialog = new EventEmitter();

  tabs = [{label: 'comments'}, {label: 'filter'}, {label: 'search'}];
  tabSelected: string;
  isFiltered: boolean;
  navigationList: Annotation[];

  constructor(private store: Store<fromStore.State>) {}


  ngOnInit(): void {
    this.store.pipe(select(fromTagSelectors.getTagFilters)).subscribe(formData => {
     this.isFiltered = !formData.length;
     this.tabs = [...this.tabs].map((tab) => {
       return !this.isFiltered && tab.label === 'filter' ? {...tab, isFiltered: true} : {...tab, isFiltered: false};
     });
    });

    this.store.pipe(select(fromAnnoSelector.getFilteredAnnotations)).subscribe(filteredAnno => {
      this.navigationList = filteredAnno.length ?
        filteredAnno.filter(annotation => annotation.comments && annotation.comments.length > 0) : [];

    });
  }

  public toggleCommentsSummary(): void {
    this.showCommentSummaryDialog.emit();
  }

  selectTab(tab: string) {
    this.tabSelected = tab !== this.tabSelected ? tab : undefined;
  }
}
