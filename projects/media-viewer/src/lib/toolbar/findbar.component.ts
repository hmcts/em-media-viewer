import { Component, Input } from '@angular/core';
import { ActionEvents, SearchOperation } from '../media-viewer/media-viewer.model';

@Component({
  selector: 'app-findbar',
  template: `
    <div class="findbar doorHanger" [ngClass]="{ hidden: searchToggle }">
      <div id="findbarInputContainer">
        <input #searchBar id="findInput" class="toolbarField" title="Find" placeholder="Find in document…" tabindex="91"
               data-l10n-id="find_input">
        <div class="splitToolbarButton">
          <button id="findPrevious" class="toolbarButton findPrevious"
                  title="Find the previous occurrence of the phrase" tabindex="92" data-l10n-id="find_previous"
                  (click)="searchPrev(searchBar.value)">
            <span data-l10n-id="find_previous_label">Previous</span>
          </button>
          <div class="splitToolbarButtonSeparator"></div>
          <button id="findNext" class="toolbarButton findNext" title="Find the next occurrence of the phrase"
                  tabindex="93" data-l10n-id="find_next" (click)="searchNext(searchBar.value)">
            <span data-l10n-id="find_next_label">Next</span>
          </button>
        </div>
      </div>
      <div id="findbarOptionsOneContainer">
        <input type="checkbox" id="findHighlightAll" class="toolbarField" tabindex="94">
        <label for="findHighlightAll" class="toolbarLabel" data-l10n-id="find_highlight">Highlight all</label>
        <input type="checkbox" id="findMatchCase" class="toolbarField" tabindex="95">
        <label for="findMatchCase" class="toolbarLabel" data-l10n-id="find_match_case_label">Match case</label>
      </div>
      <div id="findbarOptionsTwoContainer">
        <input type="checkbox" id="findEntireWord" class="toolbarField" tabindex="96">
        <label for="findEntireWord" class="toolbarLabel" data-l10n-id="find_entire_word_label">Whole words</label>
        <span id="findResultsCount" class="toolbarLabel hidden"></span>
      </div>
      <div id="findbarMessageContainer">
        <span id="findMsg" class="toolbarLabel"></span>
      </div>
    </div>
  `,
  styleUrls: ['./toolbar.component.scss']
})
export class FindbarComponent {

  @Input() searchToggle;
  @Input() actionEvents: ActionEvents;

  constructor() {}

  searchNext(searchTerm: string) {
    this.actionEvents.search.next(new SearchOperation(searchTerm));
  }

  searchPrev(searchTerm: string) {
    this.actionEvents.search.next(new SearchOperation(searchTerm, true));
  }
}
