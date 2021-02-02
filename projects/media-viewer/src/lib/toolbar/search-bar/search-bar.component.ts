import { Component, ElementRef, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { SearchResultsCount, ToolbarEventService } from '../toolbar-event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mv-search-bar',
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent implements OnInit, OnDestroy {

  @ViewChild('findInput', { static: false }) findInput: ElementRef<HTMLInputElement>;

  highlightAll = true;
  matchCase = false;
  wholeWord = false;
  resultsText = '';
  searchText = '';
  resultCount = 0;

  private subscriptions: Subscription[] = [];

  public advancedSearchVisible = false;

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    public readonly toolbarEvents: ToolbarEventService
  ) { }

  public ngOnInit(): void {
    this.subscriptions.push(
      this.toolbarEvents.searchResultsCountSubject.subscribe(results => this.setSearchResultsCount(results))
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  @HostListener('window:keydown', ['$event'])
  public onWindowKeyDown(e: KeyboardEvent): void {
    if (e.code === 'F3' || (e.ctrlKey && e.code === 'KeyF')) {
      e.preventDefault();

      this.toolbarEvents.searchBarHidden.next(false);
      setTimeout(() => this.findInput.nativeElement.focus(), 200);
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
    this.resultCount = results.total;
    this.resultsText = this.resultCount > 0
      ? `Found ${results.current} of ${results.total}`
      : 'No results found';
  }

  public onEscapeKeyPress(e: KeyboardEvent): void {
      this.toolbarEvents.searchBarHidden.next(true);
  }

  public onEnterKeyPress(e: KeyboardEvent): void {
      this.search();
  }


  public toggleAdvancedSearch(): void {
    this.advancedSearchVisible = !this.advancedSearchVisible;
  }
}
