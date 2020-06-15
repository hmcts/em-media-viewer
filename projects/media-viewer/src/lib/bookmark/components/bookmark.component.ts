import {Bookmark} from '../../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store/reducers/reducers';
import * as fromSelectors from '../../store/selectors/bookmarks.selectors';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'mv-bookmark',
  templateUrl: './bookmark.component.html'
})
export class BookmarkComponent implements OnInit, OnDestroy {

  @Input() zoom: number;
  @Input() rotate: number;
  bookmarksPerPage$: Observable<any>; // todo add type
  bookmarks: Bookmark[];
  documentId: string;

  private $subscription: Subscription;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit(): void {
    this.bookmarksPerPage$ = this.store.pipe(select(fromSelectors.getBookmarksPerPage));
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

}
