import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// import * as icpEvents from './icp-event.service';
// import { participantsListVisible } from './icp-event.service';
import { RedactionSearch } from './redaction-search-bar/redaction-search.model';
import { IcpEventService } from './icp-event.service';

// Toolbar Custom-Event Types
export type HighlightMode = boolean;
export type DrawMode = boolean;
export interface SearchOperation {
  searchTerm: string;
  highlightAll: boolean;
  matchCase: boolean;
  wholeWord: boolean;
  previous: boolean;
  reset: boolean;
}
export interface SearchResultsCount {
  current: number;
  total: number;
  isPrevious: boolean;
}

export enum SearchType {
  Redact = 'Redact',
  Highlight = 'Highlight',
}

export interface SearchMode {
  modeType: SearchType;
  isOpen: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToolbarEventService {

  constructor(private icpEventService: IcpEventService) {}

  public readonly highlightModeSubject = new BehaviorSubject<HighlightMode>(false);
  public readonly highlightToolbarSubject = new BehaviorSubject<HighlightMode>(false);
  public readonly drawModeSubject = new BehaviorSubject<DrawMode>(false);
  public readonly rotateSubject = new Subject<number>();
  public readonly searchSubject = new Subject<SearchOperation>();
  public readonly searchResultsCountSubject = new Subject<SearchResultsCount>();
  public readonly zoomSubject = new Subject<number>();
  public readonly stepZoomSubject = new Subject<number>();
  public readonly zoomValueSubject = new BehaviorSubject<number>(1);
  public readonly pageCountSubject = new Subject<number>();
  public readonly printSubject = new Subject<void>();
  public readonly downloadSubject = new Subject<void>();
  public readonly setCurrentPageSubject = new Subject<number>();
  public readonly setCurrentPageInputValueSubject = new Subject<number>();
  public readonly changePageByDeltaSubject = new Subject<number>();
  public readonly showCommentSummary = new BehaviorSubject<boolean>(false);
  public readonly grabNDrag = new BehaviorSubject<boolean>(false);
  public readonly saveRotationSubject = new Subject<void>();

  public readonly redactionMode = new BehaviorSubject(false);
  public readonly redactionPreview = new Subject<boolean>();
  public readonly applyRedactToDocument = new Subject<void>();

  public readonly clearAllRedactMarkers = new Subject<void>();
  public readonly redactWholePage = new Subject<void>();
  public readonly redactionSerachSubject = new Subject<RedactionSearch>();
  public readonly redactAllInProgressSubject = new BehaviorSubject(false);
  public readonly openRedactionSearch = new BehaviorSubject<SearchMode | null>(null);

  public readonly sidebarOpen = new BehaviorSubject(false);
  public readonly sidebarOutlineView = new BehaviorSubject(true);

  public readonly searchBarHidden = new BehaviorSubject(true);
  public readonly commentsPanelVisible = new BehaviorSubject(false);

  /**
   * Reset the stateful behaviour subjects
   */
  public reset(): void {
    this.setCurrentPageSubject.next(1);
    this.zoomValueSubject.next(1);
    this.highlightModeSubject.next(false);
    this.highlightToolbarSubject.next(false);
    this.drawModeSubject.next(false);
    this.showCommentSummary.next(false);
    this.grabNDrag.next(false);
  }

  // Function to inform Observers that highlightMode has been enabled
  public toggleHighlightMode(): void {
    // Highlight and Draw states are mutually exclusive
    if (this.highlightModeSubject.getValue() === false) {
      this.drawModeSubject.next(false);
      this.grabNDrag.next(false);
      this.highlightModeSubject.next(true);
    } else {
      this.highlightModeSubject.next(false);
    }
  }

  // Function to inform Observers that ToggleMode has been enabled
  public toggleDrawMode(): void {
    if (this.drawModeSubject.getValue() === false) {
      this.highlightModeSubject.next(false);
      this.grabNDrag.next(false);
      this.drawModeSubject.next(true);
    } else {
      this.drawModeSubject.next(false);
    }
  }

  public toggleHighlightToolbar(): void {
    this.highlightToolbarSubject.next(!this.highlightToolbarSubject.getValue());
  }

  public rotate(angle: number): void {
    this.rotateSubject.next(angle);
  }

  public search(phrase: SearchOperation): void {
    this.searchSubject.next(phrase);
  }

  public getSearchResultsCount(): Observable<SearchResultsCount> {
    return this.searchResultsCountSubject.asObservable();
  }

  public zoom(value: number): void {
    this.zoomSubject.next(value);
  }

  public stepZoom(value: number): void {
    this.stepZoomSubject.next(value);
  }

  public getZoomValue(): Observable<number> {
    return this.zoomValueSubject.asObservable();
  }

  public getPageCount(): Observable<number> {
    return this.pageCountSubject.asObservable();
  }

  public print(): void {
    this.printSubject.next();
  }

  public download(): void {
    this.downloadSubject.next();
  }

  public setPage(value: number): void {
    this.setCurrentPageSubject.next(value);
  }

  public incrementPage(value: number): void {
    this.changePageByDeltaSubject.next(value);
  }

  public getCurrentPageNumber(): Observable<number> {
    return this.setCurrentPageInputValueSubject.asObservable();
  }

  public getShowCommentSummary(): Observable<boolean> {
    return this.showCommentSummary.asObservable();
  }

  public toggleCommentsSummary(value: boolean): void {
    this.showCommentSummary.next(value);
  }

  public saveRotation(): void {
    this.saveRotationSubject.next();
  }

  public toggleGrabNDrag(): void {
    this.grabNDrag.next(!this.grabNDrag.getValue());
  }

  toggleSideBar(toggle: boolean) {
    this.sidebarOpen.next(toggle);
  }

  toggleSideBarView(toggle: boolean) {
    this.sidebarOutlineView.next(toggle);
  }

  public toggleRedactionMode(): void {
    if (this.redactionMode.getValue() === false) {
      this.drawModeSubject.next(false);
      this.grabNDrag.next(false);
      this.redactionMode.next(true);
    } else {
      this.redactionMode.next(false);
    }
    this.openRedactionSearch.next({ modeType: SearchType.Redact, isOpen: false });
  }

  public toggleRedactionPreview(viewMode: boolean): void {
    this.redactionPreview.next(viewMode);
  }

  public unmarkAll(): void {
    this.clearAllRedactMarkers.next();
  }

  public applyRedactionToDocument(): void {
    this.applyRedactToDocument.next();
  }

  public redactPage(): void {
    this.redactWholePage.next();
  }

  public toggleCommentsPanel(isVisible: boolean) {
    if (isVisible) {
      this.toggleParticipantsList(!isVisible);
    }
    this.commentsPanelVisible.next(isVisible);
  }

  public toggleParticipantsList(isVisible: boolean) {
    if (isVisible) {
      this.toggleCommentsPanel(!isVisible);
    }
    this.icpEventService.participantsListVisible.next(isVisible);
  }
}
