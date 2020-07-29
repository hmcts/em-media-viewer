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

  resetHighlight() {
    window.getSelection().removeAllRanges();
    this.toolBarEvents.highlightModeSubject.next(false);
  }
}
