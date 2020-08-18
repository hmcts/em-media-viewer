import { Directive, ElementRef, HostListener } from '@angular/core';
import { Rectangle } from '../annotation-view/rectangle/rectangle.model';
import uuid from 'uuid';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../store/reducers/reducers';
import * as fromDocument from '../../../store/selectors/document.selectors';
import { ViewerEventService } from '../../../viewers/viewer-event.service';
import * as fromAnnotationActions from '../../../store/actions/annotations.action';
import { HighlightCreateService } from './highlight-create.service';

@Directive({
  selector: '[mvCreateTextHighlight]'
})
export class HighlightCreateDirective {

  height: number;
  width: number;
  zoom: number;
  rotate: number;
  allPages: object;

  constructor(private element: ElementRef<HTMLElement>,
              private toolbarEvents: ToolbarEventService,
              private viewerEvents: ViewerEventService,
              private highlightService: HighlightCreateService,
              private store: Store<fromStore.AnnotationSetState>) {
    this.store.select(fromDocument.getPages)
      .subscribe(pages => {
        if (pages[1]) {
          this.allPages = pages;
        }
      });
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(mouseEvent: MouseEvent) {
    const pageElement = (<HTMLElement>(mouseEvent.target as HTMLElement).offsetParent).offsetParent;
    const page = parseInt(pageElement.getAttribute('data-page-number'), 10);
    if (this.toolbarEvents.highlightModeSubject.getValue()) {
      const rectangles = this.getRectangles(mouseEvent, page);
      this.viewerEvents.textSelected({ page, rectangles });
    }
  }

  @HostListener('mousedown', ['$event'])
  onPdfViewerClick(event: MouseEvent) {
    this.store.dispatch(new fromAnnotationActions.SelectedAnnotation({
      annotationId: '', selected: false, editable: false
    }));
    this.viewerEvents.clearCtxToolbar();
  }

  getRectangles(event: MouseEvent, page) {
    this.height = this.allPages[page].styles.height;
    this.width = this.allPages[page].styles.width;
    this.zoom = parseFloat(this.allPages[page].scaleRotation.scale);
    this.rotate = parseInt(this.allPages[page].scaleRotation.rotation, 10);
    const selection = window.getSelection();
    if (selection) {
      const localElement = (<HTMLElement>event.target) || (<HTMLElement>event.srcElement);

      this.removeEnhancedTextModeStyling(localElement);

      if (selection.rangeCount && !selection.isCollapsed) {
        const range = selection.getRangeAt(0).cloneRange();
        const clientRects = range.getClientRects();

        if (clientRects) {
          const parentRect = localElement.parentElement.getBoundingClientRect();
          const selectionRectangles: Rectangle[] = [];
          for (let i = 0; i < clientRects.length; i++) {
            const selectionRectangle = this.createTextRectangle(clientRects[i], parentRect);
            selectionRectangles.push(selectionRectangle);
          }
          return selectionRectangles;
        }
      }
    }
  }

  private createTextRectangle(rect: any, parentRect: any): Rectangle {
    const height = (rect.bottom - rect.top)/this.zoom;
    const width = (rect.right - rect.left)/this.zoom;
    const top = (rect.top - parentRect.top)/this.zoom;
    const left = (rect.left - parentRect.left)/this.zoom;

    let rectangle = this.highlightService.applyRotation(this.height, this.width, height, width, top, left, this.rotate, this.zoom);
    rectangle = { id: uuid(), ...rectangle };

    return rectangle as Rectangle;
  }

  resetHighlight() {
    window.getSelection().removeAllRanges();
    this.toolbarEvents.highlightModeSubject.next(false);
  }

  private removeEnhancedTextModeStyling(element: HTMLElement) {
    if (element.parentElement.children) {
      for (let i = 0; i < element.parentElement.children.length; i++) {
        const child = <HTMLElement>element.parentElement.children[i]

        child.style.padding = '0';
        // regex will be targeting the translate style in string
        // e.g. scaleX(0.969918) translateX(-110.684px) translateY(-105.274px) will become scaleX(0.969918)
        const translateCSSRegex = /translate[XYZ]\(-?\d*(\.\d+)?(px)?\)/g;
        child.style.transform = child.style.transform.replace(translateCSSRegex, '').trim();
      }
    }
  }
}
