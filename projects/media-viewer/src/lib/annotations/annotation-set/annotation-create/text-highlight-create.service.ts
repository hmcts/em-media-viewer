import { Injectable } from '@angular/core';
import { Highlight } from '../../../viewers/viewer-event.service';
import { Rectangle } from '../annotation-view/rectangle/rectangle.model';
import uuid from 'uuid';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';
import { AnnotationApiService } from '../../annotation-api.service';
import { AnnotationEventService } from '../../annotation-event.service';

@Injectable()
export class TextHighlightCreateService {

  constructor(private toolBarEvents: ToolbarEventService,
              private readonly api: AnnotationApiService,
              private readonly annotationEvents: AnnotationEventService) {}

  createTextHighlight(highlight: Highlight, annotationSet, pageInfo) {
    if (window.getSelection()) {
      const localElement = (<HTMLElement>highlight.event.target) || (<HTMLElement>highlight.event.srcElement);

      if (localElement.parentElement.childNodes) {
        localElement.parentElement.childNodes.forEach(child => {
          child['style']['padding'] = 0;
          // regex will be targeting the translate style in string
          // e.g. scaleX(0.969918) translateX(-110.684px) translateY(-105.274px) will become scaleX(0.969918)
          const translateCSSRegex = /translate[XYZ]\(-?\d*(\.\d+)?(px)?\)/g;
          child['style']['transform'] = child['style']['transform'].replace(translateCSSRegex, '');
        });
      }
      const selection = window.getSelection();
      if (selection.rangeCount && !selection.isCollapsed) {
        const range = selection.getRangeAt(0).cloneRange();
        const clientRects = range.getClientRects();

        if (clientRects) {
          const localElement = (<Element>highlight.event.target) || (<Element>highlight.event.srcElement);
          const parentRect = localElement.parentElement.getBoundingClientRect();

          const selectionRectangles: Rectangle[] = [];
          for (let i = 0; i < clientRects.length; i++) {
            const selectionRectangle = this.createTextRectangle(clientRects[i], parentRect, pageInfo);
            selectionRectangles.push(selectionRectangle);
          }
          this.saveAnnotation(selectionRectangles, annotationSet, pageInfo.number);
          selection.removeAllRanges();
          this.toolBarEvents.highlightModeSubject.next(false);
        }
      }
    }
  }

  private createTextRectangle(rect: any, parentRect: any, { zoom, rotate, pageHeight, pageWidth }) {
    const height = (rect.bottom - rect.top)/zoom;
    const width = (rect.right - rect.left)/zoom;
    const yPosition = (rect.top - parentRect.top)/zoom;
    const xPosition = (rect.left - parentRect.left)/zoom;

    const rectangle = { id: uuid(), height: height, width: width, x: 0, y: 0 };

    switch (rotate) {
      case 90:
        rectangle.width = height;
        rectangle.height = width;
        rectangle.x = yPosition;
        rectangle.y = (pageHeight/zoom) - xPosition - width;
        break;
      case 180:
        rectangle.x = (pageWidth/zoom) - xPosition - width;
        rectangle.y = (pageHeight/zoom) - yPosition - height;
        break;
      case 270:
        rectangle.width = height;
        rectangle.height = width;
        rectangle.x = (pageWidth/zoom) - yPosition - height;
        rectangle.y = xPosition;
        break;
      default:
        rectangle.x = xPosition;
        rectangle.y = yPosition;
    }
    return rectangle as Rectangle;
  }

  private saveAnnotation(rectangles: Rectangle[], annotationSet, page) {
    this.api.postAnnotation({
        id: uuid(),
        annotationSetId: annotationSet.id,
        color: 'FFFF00',
        comments: [],
        page: page,
        rectangles: rectangles,
        type: 'highlight'
      })
      .subscribe(savedAnnotation => {
        annotationSet.annotations.push(savedAnnotation);
        this.annotationEvents.selectAnnotation({ annotationId: savedAnnotation.id, editable: false });
      });
  }
}
