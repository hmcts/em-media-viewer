import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {AnnotationSet} from '../annotations/annotation-set/annotation-set.model';
import { Bookmark } from '../store/reducers';

export interface Highlight {
  page: number;
  event: MouseEvent;
  annoSet: AnnotationSet;
}

@Injectable({ providedIn: 'root' })
export class ViewerEventService {

  public readonly textHighlight = new Subject<Highlight>();
  public readonly boxHighlight = new Subject<Highlight>();
  public readonly createBookmarkEvent = new Subject<any>();
  public readonly commentsPanelVisible = new BehaviorSubject(false);

  constructor() {}

  public textSelected(selectionData: Highlight): void {
    this.textHighlight.next(selectionData);
  }

  public boxSelected(selectionData: Highlight): void {
    this.boxHighlight.next(selectionData);
  }

  public toggleCommentsPanel(toggle: boolean) {
    this.commentsPanelVisible.next(toggle);
  }
}
