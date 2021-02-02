import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SearchResultsCount } from '../../../../../projects/media-viewer/src/lib/toolbar/toolbar-event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, OnDestroy {

  @ViewChild('searchInput', { static: false }) searchElement: ElementRef;
  @Input() toolbarEvents;

  highlightAll = true;
  matchCase = false;
  wholeWord = false;
  resultsText = '';
  searchText = '';

  private subscriptions: Subscription[] = [];

  constructor() { }

  public ngOnInit(): void {
    this.subscriptions.push(
      this.toolbarEvents.searchResultsCountSubject.subscribe(results => this.setSearchResultsCount(results))
    );
  }

  ngOnDestroy(): void {
    this.toolbarEvents.search({
      searchTerm: '',
      highlightAll: this.highlightAll,
      matchCase: this.matchCase,
      wholeWord: this.wholeWord,
      previous: false,
      reset: true
    });
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public searchNext(): void {
    this.toolbarEvents.search({
      searchTerm: this.searchText,
      highlightAll: this.highlightAll,
      matchCase: this.matchCase,
      wholeWord: this.wholeWord,
      previous: false,
      reset: false
    });
  }

  public searchPrev(): void {
    this.toolbarEvents.search({
      searchTerm: this.searchText,
      highlightAll: this.highlightAll,
      matchCase: this.matchCase,
      wholeWord: this.wholeWord,
      previous: true,
      reset: false
    });
  }

  public search(): void {
    this.toolbarEvents.search({
      searchTerm: this.searchText,
      highlightAll: this.highlightAll,
      matchCase: this.matchCase,
      wholeWord: this.wholeWord,
      previous: false,
      reset: true
    });
  }

  private setSearchResultsCount(results: SearchResultsCount): void {
    this.resultsText = results.total > 0
      ? `${results.current} of ${results.total} matches`
      : 'Phrase not found';
  }
}
