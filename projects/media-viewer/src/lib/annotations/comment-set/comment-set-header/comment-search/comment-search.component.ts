import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { AnnotationSet } from '../../../annotation-set/annotation-set.model';
import { Annotation } from '../../../annotation-set/annotation-view/annotation.model';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../store';

@Component({
  selector: 'mv-comment-search',
  templateUrl: './comment-search.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommentSearchComponent implements AfterViewInit, OnDestroy {

  @Input() public readonly annotationSet: AnnotationSet;

  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

  searchString: string;
  searchResults: Annotation[] = [];
  searchIndex = 0;

  constructor(private store: Store<fromStore.AnnotationSetState>) {}

  ngAfterViewInit(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromStore.SearchComment(''));
  }

  searchComments(searchText: string): void {
    this.clearSearch();
    if (searchText.length > 2) {
      this.searchString = searchText;
      this.searchResults = this.annotationSet.annotations
        .filter(annotation => annotation.comments.length > 0)
        .filter(annotation => annotation.comments[0].content.toLowerCase().includes(this.searchString.toLowerCase()));
      if (this.searchResults.length > 0) {
        this.store.dispatch(new fromStore.SearchComment(searchText));
      }
    }
  }

  clearSearch() {
    this.searchString = undefined;
    this.searchResults = [];
    this.searchIndex = 0;
    this.store.dispatch(new fromStore.SearchComment(''));
  }
}
