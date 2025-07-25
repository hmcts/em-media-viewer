import { Directive, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Rectangle } from '../../annotation-view/rectangle/rectangle.model';
import * as fromStore from '../../../../store/reducers/reducers';
import * as fromDocument from '../../../../store/selectors/document.selectors';
import { ViewerEventService } from '../../../../viewers/viewer-event.service';
import * as fromAnnotationActions from '../../../../store/actions/annotation.actions';
import { HighlightCreateService } from './highlight-create.service';
import { ToolbarEventService } from '../../../../toolbar/toolbar-event.service';
import { HtmlTemplatesHelper } from '../../../../shared/util/helpers/html-templates.helper';

@Directive({
  selector: '[mvCreateTextHighlight]'
})
export class HighlightCreateDirective implements OnInit, OnDestroy {
  pageHeight: number;
  pageWidth: number;
  zoom: number;
  rotate: number;
  allPages: object;

  $subscription: Subscription;

  constructor(
    private element: ElementRef<HTMLElement>,
    private toolbarEvents: ToolbarEventService,
    private viewerEvents: ViewerEventService,
    private highlightService: HighlightCreateService,
    private store: Store<fromStore.AnnotationSetState>
  ) { }

  ngOnInit() {
    this.$subscription = this.store.select(fromDocument.getPages).subscribe((pages) => {
      if (pages[1]) {
        this.allPages = pages;
      }
    });
  }

  ngOnDestroy() {
    if (this.$subscription) {
      this.$subscription.unsubscribe();
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(mouseEvent: MouseEvent) {
    let page: number;
    let currentElement = mouseEvent.target as HTMLElement;
    while (currentElement.offsetParent) {
      currentElement = currentElement.offsetParent as HTMLElement;
      if (currentElement.getAttribute) {
        page = parseInt(currentElement.getAttribute('data-page-number'), 10);
        if (page) {
          break;
        }
      }
    }
    if (this.toolbarEvents.highlightModeSubject.getValue()) {
      const rectangles = this.getRectangles(mouseEvent, page);
      this.viewerEvents.textSelected({ page, rectangles });
    }
  }

  @HostListener('mousedown', ['$event'])
  onPdfViewerClick(event: MouseEvent) {
    this.store.dispatch(
      new fromAnnotationActions.SelectedAnnotation({
        annotationId: '',
        selected: false,
        editable: false,
      })
    );
    this.viewerEvents.clearCtxToolbar();
  }

  private getRectangles(event: MouseEvent, page) {
    this.pageHeight = this.allPages[page].styles.height;
    this.pageWidth = this.allPages[page].styles.width;
    this.zoom = parseFloat(this.allPages[page].scaleRotation.scale);
    this.rotate = parseInt(this.allPages[page].scaleRotation.rotation, 10);
    const selection = window.getSelection();
    if (selection) {
      const localElement = <HTMLElement>event.target;

      this.removeEnhancedTextModeStyling(localElement);

      if (selection.rangeCount && !selection.isCollapsed) {
        const range = selection.getRangeAt(0).cloneRange();
        const clientRects = range.getClientRects();

        if (clientRects) {

          const parentRect = HtmlTemplatesHelper
            .getAdjustedBoundingRect(localElement.closest(".textLayer"));
          const selectionRectangles: Rectangle[] = [];
          for (let i = 0; i < clientRects.length; i++) {
            const selectionRectangle = this.createTextRectangle(clientRects[i], parentRect);
            const findSelecttionRectangle = selectionRectangles.find(
              (rect) => rect.width === selectionRectangle.width && rect.x === selectionRectangle.x
            );
            if (!findSelecttionRectangle) {
              selectionRectangles.push(selectionRectangle);
            }
          }
          return selectionRectangles;
        }
      }
    }
  }

  private createTextRectangle(rect: any, parentRect: any): Rectangle {
    const height = rect.bottom - rect.top;
    const width = rect.right - rect.left;
    const top = rect.top - parentRect.top;
    const left = rect.left - parentRect.left;

    let rectangle = this.highlightService.applyRotation(
      this.pageHeight,
      this.pageWidth,
      height,
      width,
      top,
      left,
      this.rotate,
      this.zoom
    );
    rectangle = { id: uuid(), ...rectangle };

    return rectangle as Rectangle;
  }

  private removeEnhancedTextModeStyling(element: HTMLElement) {
    if (element.parentElement.children) {
      for (let i = 0; i < element.parentElement.children.length; i++) {
        const child = <HTMLElement>element.parentElement.children[i];

        child.style.padding = '0';
        // regex will be targeting the translate style in string
        // e.g. scaleX(0.969918) translateX(-110.684px) translateY(-105.274px) will become scaleX(0.969918)
        const translateCSSRegex = /translate[XYZ]\(-?\d*(\.\d+)?(px)?\)/g;
        child.style.transform = child.style.transform.replace(translateCSSRegex, '').trim();
      }
    }
  }
}
