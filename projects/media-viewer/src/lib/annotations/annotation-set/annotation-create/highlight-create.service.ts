import { Injectable } from '@angular/core';
import { Highlight } from '../../../viewers/viewer-event.service';
import { Rectangle } from '../annotation-view/rectangle/rectangle.model';
import uuid from 'uuid';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';
import { AnnotationApiService } from '../../annotation-api.service';

import {select, Store} from '@ngrx/store';
import * as fromStore from '../../../store/reducers';
import * as fromSelectors from '../../../store/selectors/annotations.selectors';
import * as fromActions from '../../../store/actions/annotations.action';
import {take} from 'rxjs/operators';

@Injectable()
export class HighlightCreateService {

  constructor(private toolBarEvents: ToolbarEventService,
              private readonly api: AnnotationApiService,
              private store: Store<fromStore.AnnotationSetState>) {}

  getRectangles(highlight: Highlight, pageInfo) {
    const selection = window.getSelection();
    if (selection) {
      const localElement = (<HTMLElement>highlight.event.target) || (<HTMLElement>highlight.event.srcElement);

      this.removeEnhancedTextModeStyling(localElement);

      if (selection.rangeCount && !selection.isCollapsed) {
        const range = selection.getRangeAt(0).cloneRange();
        const clientRects = range.getClientRects();

        if (clientRects) {
          const parentRect = localElement.parentElement.getBoundingClientRect();

          const selectionRectangles: Rectangle[] = [];
          for (let i = 0; i < clientRects.length; i++) {
            const selectionRectangle = this.createTextRectangle(clientRects[i], parentRect, pageInfo);
            selectionRectangles.push(selectionRectangle);
          }
          return selectionRectangles;
        }
      }
    }
  }

  private createTextRectangle(rect: any, parentRect: any, { zoom, rotate, pageHeight, pageWidth }) {
    const height = (rect.bottom - rect.top)/zoom;
    const width = (rect.right - rect.left)/zoom;
    const top = (rect.top - parentRect.top)/zoom;
    const left = (rect.left - parentRect.left)/zoom;

    const rectangle = { id: uuid(), height: height, width: width, x: 0, y: 0 };

    switch (rotate) {
      case 90:
        rectangle.width = height;
        rectangle.height = width;
        rectangle.x = top;
        rectangle.y = (pageWidth/zoom) - left - width;
        break;
      case 180:
        rectangle.x = (pageWidth/zoom) - left - width;
        rectangle.y = (pageHeight/zoom) - top - height;
        break;
      case 270:
        rectangle.width = height;
        rectangle.height = width;
        rectangle.x = (pageHeight/zoom) - top - height;
        rectangle.y = left;
        break;
      default:
        rectangle.x = left;
        rectangle.y = top;
    }
    return rectangle as Rectangle;
  }

  private saveAnnotation(rectangles: Rectangle[], annotationSetId, page) {
    this.store.pipe(select(fromSelectors.getDocumentIdSetId), take(1)).subscribe(anoSetDocId => {
      const anno = {
        id: uuid(),
        annotationSetId: annotationSetId,
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

  private removeEnhancedTextModeStyling(element: HTMLElement) {
    if (element.parentElement.childNodes) {
      element.parentElement.childNodes.forEach(child => {
        child['style']['padding'] = 0;
        // regex will be targeting the translate style in string
        // e.g. scaleX(0.969918) translateX(-110.684px) translateY(-105.274px) will become scaleX(0.969918)
        const translateCSSRegex = /translate[XYZ]\(-?\d*(\.\d+)?(px)?\)/g;
        child['style']['transform'] = child['style']['transform'].replace(translateCSSRegex, '').trim();
      });
    }
  }
}
