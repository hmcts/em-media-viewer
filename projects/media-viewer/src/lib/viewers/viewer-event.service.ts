import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Highlight {
  page: number;
  event: MouseEvent;
}

@Injectable({ providedIn: 'root' })
export class ViewerEventService {

  // Register Observable Subject Events relevant to the Viewers
  public readonly textHighlight = new Subject<Highlight>();
  public readonly shapeHighlight = new Subject<Highlight>();
  public readonly commentsPanelVisible = new BehaviorSubject(false);

  constructor() {}

  // Function to inform Observers that text has been selected in the viewer
  public textSelected(selectionData: Highlight): void {
    this.textHighlight.next(selectionData);
  }

  // Function to inform Observers that shape has been selected in the viewer
  public shapeSelected(selectionData: Highlight): void {
    this.shapeHighlight.next(selectionData);
  }

  public toggleCommentsPanel(toggle: boolean) {
    this.commentsPanelVisible.next(toggle);
  }
}
