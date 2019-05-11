import { Component, Input } from '@angular/core';
import { ActionEvents, SearchOperation } from '../../media-viewer.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mv-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['../styles/toolbar.component.scss']
})
export class SearchBarComponent {

  @Input() searchbarHide: BehaviorSubject<boolean>;
  @Input() actionEvents: ActionEvents;

  constructor() {}

  searchNext(searchTerm: string) {
    this.actionEvents.search.next(new SearchOperation(searchTerm));
  }

  searchPrev(searchTerm: string) {
    this.actionEvents.search.next(new SearchOperation(searchTerm, true));
  }
}
