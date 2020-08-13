import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {AnnotationSet} from '../annotations/annotation-set/annotation-set.model';

export interface Highlight {
  page: number;
  event: MouseEvent;
  annoSet: AnnotationSet;
}

@Injectable({ providedIn: 'root' })
export class ViewerEventService {

  public readonly textHighlight = new Subject<Highlight>();
  public readonly boxHighlight = new Subject<Highlight>();
  public readonly ctxToolbarCleared = new Subject();
  public readonly navigationEvent = new Subject<any[]>();

  constructor() {}

  public textSelected(selectionData: Highlight): void {
    this.textHighlight.next(selectionData);
  }

  public boxSelected(selectionData: Highlight): void {
    this.boxHighlight.next(selectionData);
  }

  public clearCtxToolbar(): void {
    this.ctxToolbarCleared.next();
  }


  public goToDestination(destination: any[]) {
    this.navigationEvent.next(destination);
  }
}
