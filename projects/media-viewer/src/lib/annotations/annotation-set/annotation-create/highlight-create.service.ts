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
      x: +(offsetLeft / zoom).toFixed(2),
      y: +(offsetTop / zoom).toFixed(2),
      width: +(offsetWidth / zoom).toFixed(2),
      height: +(offsetHeight / zoom).toFixed(2)
    };
    const rectangle = { x, y, width, height };
    switch (rotate) {
      case 90:
        rectangle.width = height;
        rectangle.height = width;
        rectangle.x = y;
        rectangle.y = +(pageWidth / zoom - x - width).toFixed(2);
        break;
      case 180:
        rectangle.x = +(pageWidth / zoom - x - width).toFixed(2);
        rectangle.y = +(pageHeight / zoom - y - height).toFixed(2);
        break;
      case 270:
        rectangle.width = height;
        rectangle.height = width;
        rectangle.x = +(pageHeight / zoom - y - height).toFixed(2);
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
