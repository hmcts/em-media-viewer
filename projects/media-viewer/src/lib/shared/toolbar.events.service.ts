import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

// Toolbar Custom-Event Types
export type HighlightMode = boolean;
export type DrawMode = boolean;

@Injectable({providedIn: 'root'})
export class ToolbarEventsService {
  // Register Observable Subject Events relevant to the Toolbar
  highlightMode = new BehaviorSubject<HighlightMode>(false);
  drawMode = new BehaviorSubject<DrawMode>(false);
  constructor() {}

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
