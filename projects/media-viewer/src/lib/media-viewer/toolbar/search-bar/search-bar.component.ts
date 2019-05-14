import { Component, Input } from '@angular/core';
import { SearchOperation, SearchResultsCount } from '../../media-viewer.model';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Component({
  selector: 'mv-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['../styles/toolbar.component.scss']
})
export class SearchBarComponent {

  @Input() searchbarHide: BehaviorSubject<boolean>;
  @Input() searchEvents: Subject<SearchOperation>;
  @Input() searchResultsCount: Observable<SearchResultsCount>;

  highlightAll = true;
  matchCase = false;
  wholeWord = false;
  resultsText = '';
  searchText = '';
  haveResults = false;

  constructor() {}

  ngOnInit() {
    this.searchResultsCount.subscribe(r => this.onUpdateResults(r));
  }

  searchNext() {
    this.searchEvents.next(new SearchOperation(
      this.searchText,
      this.highlightAll,
      this.matchCase,
      this.wholeWord,
      false,
      false
    ));
  }

  searchPrev() {
    this.searchEvents.next(new SearchOperation(
      this.searchText,
      this.highlightAll,
      this.matchCase,
      this.wholeWord,
      true,
      false
    ));
  }

  search() {
    this.searchEvents.next(new SearchOperation(
      this.searchText,
      this.highlightAll,
      this.matchCase,
      this.wholeWord,
      false,
      true
    ));
  }

  onUpdateResults(results: SearchResultsCount) {
    this.haveResults = results.total > 0;
    this.resultsText = this.haveResults
      ? `${results.current} of ${results.total} matches`
      : 'Phrase not found';
  }
}
