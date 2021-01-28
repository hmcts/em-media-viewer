import { Injectable } from '@angular/core';
import { Rectangle } from '../annotation-view/rectangle/rectangle.model';
import uuid from 'uuid';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../../store/reducers/reducers';
import * as fromSelectors from '../../../store/selectors/annotations.selectors';
import * as fromActions from '../../../store/actions/annotations.action';
import { take } from 'rxjs/operators';

@Injectable()
export class HighlightCreateService {

  constructor(private toolBarEvents: ToolbarEventService,
              private store: Store<fromStore.AnnotationSetState>) {}

  saveAnnotation(rectangles: Rectangle[], page) {
    this.store.pipe(select(fromSelectors.getDocumentIdSetId), take(1)).subscribe(anoSetDocId => {
      const anno = {
        id: uuid(),
        color: 'FFFF00',
        comments: [],
        page: page,
        rectangles: rectangles,
        type: 'highlight',
        ...anoSetDocId
      };
      this.store.dispatch(new fromActions.SaveAnnotation(anno));
    });
  }

  applyRotation(pageHeight, pageWidth, offsetHeight, offsetWidth, offsetTop, offsetLeft, rotate, zoom ) {
    const { x, y, width, height } = {
      x: Math.round(offsetLeft/zoom),
      y: Math.round(offsetTop/zoom),
      width: Math.round(offsetWidth/zoom),
      height: Math.round(offsetHeight/zoom)
    };
    const rectangle = { x, y, width, height };
    switch (rotate) {
      case 90:
        rectangle.width = height;
        rectangle.height = width;
        rectangle.x = y;
        rectangle.y = Math.round(pageWidth/zoom) - x - width;
        break;
      case 180:
        rectangle.x = Math.round(pageWidth/zoom) - x - width;
        rectangle.y = Math.round(pageHeight/zoom) - y - height;
        break;
      case 270:
        rectangle.width = height;
        rectangle.height = width;
        rectangle.x = Math.round(pageHeight/zoom) - y - height;
        rectangle.y = x;
        break;
    }
    return rectangle as any;
  }

  resetHighlight() {
    window.getSelection().removeAllRanges();
    this.toolBarEvents.highlightModeSubject.next(false);
  }
}
