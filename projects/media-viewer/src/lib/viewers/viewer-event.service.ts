import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';


// Viewer Custom-Event Types
export interface TextSelectionRectangle {
  x: number;
  y: number;
  height: number;
  width: number;
}
export type TextSelected = TextSelectionRectangle[];


@Injectable({providedIn: 'root'})
export class ViewerEventService {
  // Register Observable Subject Events relevant to the Viewers
  textSelected = new Subject<TextSelected>();
  constructor() {}

  // Function to inform Observers that text has been selected in the viewer
  public onTextSelection(selectionData: TextSelected): void {
    // DO SOMETHING IN THE FUTURE
  }
}
