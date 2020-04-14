import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';
import { AnnotationSet } from '../../annotation-set/annotation-set.model';
import { Annotation } from '../../annotation-set/annotation-view/annotation.model';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../../store/reducers';
import * as fromTagSelectors from '../../../store/selectors/tags.selectors';

@Component({
  selector: 'mv-comment-set-header',
  templateUrl: './comment-set-header.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommentSetHeaderComponent implements OnChanges, OnInit {

  @Input() public readonly annotationSet: AnnotationSet;
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
     this.tabs = [...this.tabs].map((tab, i) => {
       return !this.isFiltered && tab.label === 'filter' ? {...tab, isFiltered: true} : {...tab, isFiltered: false};
     })
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.annotationSet && this.annotationSet) {
      this.navigationList = [...this.annotationSet.annotations]
        .filter(annotation => annotation.comments && annotation.comments.length > 0);
    }
  }

  public toggleCommentsSummary(): void {
    this.showCommentSummaryDialog.emit();
  }

  selectTab(tab: string) {
    this.tabSelected = tab !== this.tabSelected ? tab : undefined;
  }
}
