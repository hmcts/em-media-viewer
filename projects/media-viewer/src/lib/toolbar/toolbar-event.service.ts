import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

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
  public readonly highlightMode = new BehaviorSubject<HighlightMode>(false);
  public readonly drawMode = new BehaviorSubject<DrawMode>(false);
  public readonly rotate = new Subject<number>();
  public readonly search = new Subject<SearchOperation>();
  public readonly searchResultsCount = new Subject<SearchResultsCount>();
  public readonly zoom = new Subject<number>();
  public readonly stepZoom = new Subject<number>();
  public readonly zoomValue = new BehaviorSubject<number>(1);
  public readonly print = new Subject();
  public readonly download = new Subject();
  public readonly setCurrentPage = new Subject<number>();
  public readonly changePageByDelta = new Subject<number>();

  /**
   * Reset the stateful behaviour subjects
   */
  public reset(): void {
    this.setCurrentPage.next(1);
    this.zoomValue.next(1);
    this.highlightMode.next(false);
    this.drawMode.next(false);
  }

  // Function to inform Observers that highlightMode has been enabled
  public toggleHighlightMode(): void {
    // Highlight and Draw states are mutually exclusive
    if (this.highlightMode.getValue() === false) {
      this.drawMode.next(false);
      this.highlightMode.next(true);
    } else {
      this.highlightMode.next(false);
    }
  }

  // Function to inform Observers that ToggleMode has been enabled
  public toggleDrawMode(): void {
    //  Draw and Highlight states are mutually exclusive
    if (this.drawMode.getValue() === false) {
      this.highlightMode.next(false);
      this.drawMode.next(true);
    } else {
      this.drawMode.next(false);
    }
  }
}
