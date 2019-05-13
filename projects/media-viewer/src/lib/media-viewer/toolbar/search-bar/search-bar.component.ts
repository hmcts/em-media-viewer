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

  public resultsText = '';

  constructor() {}

  ngOnInit() {
    this.searchResultsCount.subscribe(r => this.onUpdateResults(r));
  }

  searchNext(searchTerm: string) {
    this.searchEvents.next(new SearchOperation(searchTerm, false, false));
  }

  searchPrev(searchTerm: string) {
    this.searchEvents.next(new SearchOperation(searchTerm, true, false));
  }

  search(searchTerm: string) {
    this.searchEvents.next(new SearchOperation(searchTerm, false, true));
  }

  onUpdateResults(results: SearchResultsCount) {
    console.log("Results", results);
    this.resultsText = `${results.current} of ${results.total} matches`;
  }
}
