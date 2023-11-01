import { BulkRedaction, Redaction } from './../../redaction/services/redaction.model';
import { SearchMode, SearchResultsCount, SearchType } from './../toolbar-event.service';
import { RedactionSearch, RedactRectangle } from './redaction-search.model';
import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { ToolbarEventService } from '../toolbar-event.service';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store/reducers/reducers';
import { Rectangle } from '../../annotations/annotation-set/annotation-view/rectangle/rectangle.model';
import * as fromDocument from '../../store/selectors/document.selectors';
import * as fromRedactionActions from '../../store/actions/redaction.actions';
import uuid from 'uuid';
import { HighlightCreateService } from '../../annotations/annotation-set/annotation-create/highlight-create/highlight-create.service';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { Annotation } from '../../annotations/annotation-set/annotation-view/annotation.model';

@Component({
  selector: 'mv-redaction-search-bar',
  templateUrl: './redaction-search-bar.component.html',
  styleUrls: ['./redaction-search-bar.component.scss']
})
export class RedactionSearchBarComponent implements OnInit {

  @ViewChild('findInput', { static: true }) findInput: ElementRef<HTMLInputElement>;

  highlightAll = true;
  matchCase = false;
  wholeWord = false;
  resultsText = '';
  searchText = '';
  resultCount = 0;
  redactElements: RedactRectangle[] = [];
  pageHeight: number;
  pageWidth: number;
  zoom: number;
  rotate: number;
  allPages: object;
  redactAll: boolean;
  openSearchModal: boolean;
  redactAllInProgress: boolean;
  redactAllText?: string;
  searchType: SearchType
  inProgessText: string;
  titleText: string;


  private subscription: Subscription;
  private documentId: string;
  public advancedSearchVisible = false;


  constructor(
    private store: Store<fromStore.State>,
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    public readonly toolbarEvents: ToolbarEventService,
    public readonly highlightService: HighlightCreateService,
  ) { }

  public ngOnInit(): void {
    this.subscription = this.toolbarEvents.redactionSerachSubject.subscribe((results: RedactionSearch) => this.redactAllSearched(results));
    this.subscription.add(this.store.pipe(select(fromDocument.getDocumentId)).subscribe(docId => this.documentId = docId));
    this.subscription.add(this.store.pipe(select(fromDocument.getPages)).subscribe((pages) => {
      if (pages[1]) {
        this.allPages = pages;
      }
    }));
    this.subscription.add(
      this.toolbarEvents.searchResultsCountSubject.subscribe(results => this.setSearchResultsCount(results))
    );
    this.subscription.add(this.toolbarEvents.openRedactionSearch.subscribe((searchMode: SearchMode) => {
      if (searchMode) {
        this.openSearchModal = searchMode.isOpen;
        this.searchType = searchMode.modeType;
        this.modeText();
      }
    }));
    this.subscription.add(this.toolbarEvents.redactAllInProgressSubject
      .subscribe(inProgress => this.redactAllInProgress = inProgress));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('window:keydown', ['$event'])
  public onWindowKeyDown(e: KeyboardEvent): void {
    if (e.code === 'F3' || (e.ctrlKey && e.code === 'KeyF')) {
      e.preventDefault();
      this.toolbarEvents.searchBarHidden.next(false);
      setTimeout(() => this.findInput.nativeElement.focus(), 200);
    }
  }

  search(reset: boolean = true): void {
    this.redactAll = !reset;
    if (this.redactAll) {
      this.toolbarEvents.redactAllInProgressSubject.next(true);
    }
    if (reset) {
      this.redactElements = [];
    }
    this.toolbarEvents.search({
      searchTerm: this.searchText,
      highlightAll: this.highlightAll,
      matchCase: this.matchCase,
      wholeWord: this.wholeWord,
      previous: false,
      reset
    });
  }

  modeText(): void {
    if (this.searchType === SearchType.Highlight) {
      this.inProgessText = 'Highlighting';
      this.titleText = 'Highlight';
    }
    else if (this.searchType === SearchType.Redact) {
      this.inProgessText = 'Redacting';
      this.titleText = 'Redact';
    }
  }

  public saveRedaction(redactRectangle: RedactRectangle[]) {
    const redaction = redactRectangle.map(ele => {
      return { page: ele.page, rectangles: ele.rectangles, redactionId: uuid(), documentId: this.documentId } as Redaction;
    });
    this.store.dispatch(new fromRedactionActions.SaveBulkRedaction({ searchRedactions: redaction } as BulkRedaction));
  }

  private existInRedactElements(pageNumber: number, matechedIndex: number, rectangles: Rectangle[]): boolean {
    if (this.redactElements && this.redactElements.length > 0) {
      const pagesFound = this.redactElements.find(re => re.page === pageNumber && re.matchedIndex === matechedIndex);
      const pageRectangles = pagesFound?.rectangles;
      if (!pageRectangles || pageRectangles.length <= 0) {
        return false;
      }
      let matchesRectangles = 0;
      for (let rectIndx = 0; rectIndx < pageRectangles.length; rectIndx++) {
        const rectangle = pageRectangles[rectIndx];
        const foundRectangle = rectangles.find(re => re.width === rectangle.width &&
          re.height === rectangle.height && re.x === rectangle.x && re.y === rectangle.y);
        if (foundRectangle) {
          matchesRectangles++;
        }
      }
      return pageRectangles.length === matchesRectangles;
    }
    return false;
  }

  onCloseSearchModal() {
    this.toolbarEvents.openRedactionSearch.next({ isOpen: false, modeType: this.searchType });
  }


  private setSearchResultsCount(results: SearchResultsCount): void {
    this.resultCount = results.total;
    this.resultsText = this.resultCount > 0
      ? `${results.total} results founds`
      : 'No results found';
  }

  private redactAllSearched(results: RedactionSearch): void {
    const $this = this;
    const intervalId = setInterval(() => {
      const highlightElement = document.getElementsByClassName('highlight selected');
      if (highlightElement && highlightElement.length > 0) {
        clearInterval(intervalId);
        $this.redactAllSearchedTick(results);
      }
    }, 100);
  }


  private redactAllSearchedTick(results: RedactionSearch): void {
    const highlightElement = document.getElementsByClassName('highlight selected');
    if (highlightElement && highlightElement.length > 0) {
      this.resultCount = results.matchesCount;
      const pageNumber = results.page + 1;
      const rectangles = this.getRectangles(pageNumber);
      if (rectangles && this.redactElements.length <= this.resultCount
        && !this.existInRedactElements(pageNumber, results.matchedIndex, rectangles)) {
        this.redactElements.push({ page: pageNumber, matchedIndex: results?.matchedIndex, rectangles } as RedactRectangle);
        this.CreateRedactAllText();
      }
      if (this.redactAll && this.resultCount && this.resultCount > 0
        && rectangles && this.redactElements.length < this.resultCount) {
        this.search(false);
      }

      if (this.redactAll && this.resultCount && this.redactElements.length === this.resultCount) {
        this.redactAll = false;
        this.redactAllText = null;
        if (this.searchType === SearchType.Redact) {
          this.saveRedaction(this.redactElements);
        }
        else if (this.searchType === SearchType.Highlight) {
          // this.redactElements.forEach(ele => {
          //   this.highlightService.saveAnnotation(ele.rectangles, ele.page);
          // });
          this.highlightService.saveAnnotationSet(this.redactElements);
          this.toolbarEvents.redactAllInProgressSubject.next(false);
        }
      }
    }
  }

  private CreateRedactAllText() {
    this.redactAllText = `${this.redactElements.length} of ${this.resultCount}`;
  }

  public onEscapeKeyPress(e: KeyboardEvent): void {
    this.toolbarEvents.searchBarHidden.next(true);
  }

  public onEnterKeyPress(e: KeyboardEvent): void {
    this.search();
  }

  public toggleSearchBar() {
    this.toolbarEvents.searchBarHidden.next(!this.toolbarEvents.searchBarHidden.getValue());
  }

  private getRectangles(page: number): Rectangle[] {
    this.pageHeight = this.allPages[page].styles.height;
    this.pageWidth = this.allPages[page].styles.width;
    this.zoom = parseFloat(this.allPages[page].scaleRotation.scale);
    this.rotate = parseInt(this.allPages[page].scaleRotation.rotation, 10);
    const selectedHighLightedElements = document.getElementsByClassName('highlight selected');
    if (selectedHighLightedElements && selectedHighLightedElements.length > 0) {
      const docRange = document.createRange();
      docRange.selectNodeContents(selectedHighLightedElements[0] as HTMLElement);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(docRange);
      if (selection.rangeCount && !selection.isCollapsed) {
        const range = selection.getRangeAt(0).cloneRange();
        const clientRects = range.getClientRects();

        if (clientRects) {
          const parentRect = selectedHighLightedElements[0].parentElement.parentElement.getBoundingClientRect();
          const selectionRectangles: Rectangle[] = [];
          for (let i = 0; i < clientRects.length; i++) {
            const selectionRectangle = this.createTextRectangle(clientRects[i], parentRect);
            const findSelecttionRectangle = selectionRectangles.find(
              (rect) => rect.width === selectionRectangle.width && rect.x === selectionRectangle.x
            );
            if (!findSelecttionRectangle) {
              selectionRectangles.push(selectionRectangle);
            }
          }

          return selectionRectangles;
        }
      }
    }
  }

  private createTextRectangle(rect: DOMRect, parentRect: any): Rectangle {
    const height = rect.bottom - rect.top;
    const width = rect.right - rect.left;
    const top = rect.top - parentRect.top;
    const left = rect.left - parentRect.left;

    let rectangle = this.highlightService.applyRotation(
      this.pageHeight,
      this.pageWidth,
      height,
      width,
      top,
      left,
      this.rotate,
      this.zoom
    );
    rectangle = { id: uuid(), ...rectangle };

    return rectangle as Rectangle;
  }
}
