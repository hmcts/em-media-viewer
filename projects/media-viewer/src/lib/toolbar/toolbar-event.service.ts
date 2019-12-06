import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

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
}

@Injectable({ providedIn: 'root' })
export class ToolbarEventService {
  public readonly highlightModeSubject = new BehaviorSubject<HighlightMode>(false);
  public readonly drawModeSubject = new BehaviorSubject<DrawMode>(false);
  public readonly rotateSubject = new Subject<number>();
  public readonly searchSubject = new Subject<SearchOperation>();
  public readonly searchResultsCountSubject = new Subject<SearchResultsCount>();
  public readonly zoomSubject = new Subject<number>();
  public readonly stepZoomSubject = new Subject<number>();
  public readonly zoomValueSubject = new BehaviorSubject<number>(1);
  public readonly printSubject = new Subject();
  public readonly downloadSubject = new Subject();
  public readonly setCurrentPageSubject = new Subject<number>();
  public readonly setCurrentPageInputValueSubject = new Subject<number>();
  public readonly changePageByDeltaSubject = new Subject<number>();
  public readonly showCommentSummary = new BehaviorSubject<boolean>(false);

  /**
   * Reset the stateful behaviour subjects
   */
  public reset(): void {
    this.setCurrentPageSubject.next(1);
    this.zoomValueSubject.next(1);
    this.highlightModeSubject.next(false);
    this.drawModeSubject.next(false);
    this.showCommentSummary.next(false);
  }

  // Function to inform Observers that highlightMode has been enabled
  public toggleHighlightMode(): void {
    // Highlight and Draw states are mutually exclusive
    if (this.highlightModeSubject.getValue() === false) {
      this.drawModeSubject.next(false);
      this.highlightModeSubject.next(true);
    } else {
      this.highlightModeSubject.next(false);
    }
  }

  // Function to inform Observers that ToggleMode has been enabled
  public toggleDrawMode(): void {
    //  Draw and Highlight states are mutually exclusive
    if (this.drawModeSubject.getValue() === false) {
      this.highlightModeSubject.next(false);
      this.drawModeSubject.next(true);
    } else {
      this.drawModeSubject.next(false);
    }
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

  public getCommentSummary(): Observable<boolean> {
    return this.showCommentSummary.asObservable();
  }

  public toggleCommentsSummary(value: boolean): void {
    this.showCommentSummary.next(value);
  }
}
