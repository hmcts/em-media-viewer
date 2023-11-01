import { Injectable } from '@angular/core';
import { take, map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { v4 as uuid } from 'uuid';
import moment from 'moment-timezone';


import { Rectangle } from '../../annotation-view/rectangle/rectangle.model';
import { ToolbarEventService } from '../../../../toolbar/toolbar.module';
import * as fromStore from '../../../../store/reducers/reducers';
import * as fromSelectors from '../../../../store/selectors/annotation.selectors';
import * as fromActions from '../../../../store/actions/annotation.actions';
import { Annotation } from '../../annotation-view/annotation.model';
import { RedactRectangle } from '../../../../toolbar/redaction-search-bar/redaction-search.model';
import { AnnotationSet } from '../../annotation-set.model';

@Injectable()
export class HighlightCreateService {

  constructor(private toolBarEvents: ToolbarEventService,
    private store: Store<fromStore.AnnotationSetState>) { }

  saveAnnotation(rectangles: Rectangle[], page: number) {
    this.store.pipe(select(fromSelectors.getDocumentIdSetId), take(1)).subscribe(anoSetDocId => {
      const anno: Annotation = {
        id: uuid(),
        color: 'FFFF00',
        comments: [],
        page: page,
        rectangles: rectangles,
        type: 'highlight',
        ...anoSetDocId,
        createdBy: '',
        createdByDetails: undefined,
        createdDate: moment.utc().tz('Europe/London').toISOString(),
        lastModifiedBy: '',
        lastModifiedByDetails: undefined,
        lastModifiedDate: '',
        tags: [],
      };
      this.store.dispatch(new fromActions.SaveAnnotation(anno));
    });
  }

  saveAnnotationSet(searchRectangles: RedactRectangle[]) {
    this.store.pipe(select(fromSelectors.getDocumentIdSetId), take(1)).subscribe(anoSetDocId => {
      const annoSet = searchRectangles.map(x => {
        return {
          id: uuid(),
          color: 'FFFF00',
          comments: [],
          page: x.page,
          rectangles: x.rectangles,
          type: 'highlight',
          ...anoSetDocId,
          createdBy: '',
          createdByDetails: undefined,
          createdDate: moment.utc().tz('Europe/London').toISOString(),
          lastModifiedBy: '',
          lastModifiedByDetails: undefined,
          lastModifiedDate: '',
          tags: [],
        } as Annotation
      });
      this.store.dispatch(new fromActions.SaveAnnotationSet({ id:anoSetDocId.annotationSetId, annotations: annoSet, documentId: anoSetDocId.documentId } as AnnotationSet));
    });
  }


  applyRotation(pageHeight, pageWidth, offsetHeight, offsetWidth, offsetTop, offsetLeft, rotate, zoom) {
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
