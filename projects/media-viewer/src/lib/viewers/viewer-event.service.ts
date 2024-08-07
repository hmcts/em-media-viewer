import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Rectangle } from '../annotations/annotation-set/annotation-view/rectangle/rectangle.model';

export interface Highlight {
  page: number;
  rectangles: Rectangle[];
}

@Injectable({ providedIn: 'root' })
export class ViewerEventService {

  public readonly textHighlight = new Subject<Highlight>();
  public readonly boxHighlight = new Subject<Highlight>();
  public readonly ctxToolbarCleared = new Subject<void>();
  public readonly navigationEvent = new Subject<any[]>();
  public readonly navigationEventICP = new Subject<any[]>();

  constructor() { }

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

  public goToDestinationICP(destination: any[]) {
    this.navigationEventICP.next(destination);
  }
}
