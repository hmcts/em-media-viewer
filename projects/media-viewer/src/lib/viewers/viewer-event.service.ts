import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Rectangle} from '../annotations/annotation-set/annotation/rectangle/rectangle.model';

export interface TextHighlight {
  page: number;
  event: MouseEvent;
}

@Injectable({providedIn: 'root'})
export class ViewerEventService {
  // Register Observable Subject Events relevant to the Viewers
  public readonly highlightedText = new Subject<TextHighlight>();
  constructor() {}

  // Function to inform Observers that text has been selected in the viewer
  public onTextSelection(selectionData: TextHighlight): void {
    this.highlightedText.next(selectionData);
  }
}
