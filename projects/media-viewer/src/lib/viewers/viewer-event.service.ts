import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Highlight {
  page: number;
  event: MouseEvent;
}

@Injectable({ providedIn: 'root' })
export class ViewerEventService {

  // Register Observable Subject Events relevant to the Viewers
  public readonly highlightedText = new Subject<Highlight>();
  public readonly highlightedShape = new Subject<Highlight>();
  public readonly commentsPanelToggle = new BehaviorSubject(true);

  constructor() {}

  // Function to inform Observers that text has been selected in the viewer
  public onTextSelection(selectionData: Highlight): void {
    this.highlightedText.next(selectionData);
  }

  // Function to inform Observers that shape has been selected in the viewer
  public onShapeSelection(selectionData: Highlight): void {
    this.highlightedShape.next(selectionData);
  }

  public toggleCommentsPanel(toggle: boolean) {
    this.commentsPanelToggle.next(toggle);
  }
}
