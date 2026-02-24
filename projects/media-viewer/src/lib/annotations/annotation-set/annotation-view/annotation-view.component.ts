import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Annotation } from './annotation.model';
import { Rectangle } from './rectangle/rectangle.model';
import moment from 'moment-timezone';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../store/reducers/reducers';
import * as fromActions from '../../../store/actions/annotation.actions';
import { SelectionAnnotation } from '../../models/event-select.model';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { Comment } from '../../comment-set/comment/comment.model';
import { asyncScheduler, observeOn, Subject } from 'rxjs';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]'
].join(',');

@Component({
    selector: 'mv-annotation',
    templateUrl: './annotation-view.component.html',
    standalone: false
})
export class AnnotationViewComponent implements OnDestroy {  // todo rename this to selection vew c

  @Input() set annotation(value) {
    this.anno = { ...value };
  }
  anno: Annotation;
  selected: boolean;
  isKeyboardMoving = false;
  showToolbar = false;
  private showToolbarSubject = new Subject<boolean>();

  @Input() zoom: number;
  @Input() rotate: number;
  @Input() set selectedAnnoId(selectedId: { annotationId: string }) {
    if (selectedId) {
      const id = this.anno.id || this.anno.redactionId; // todo make it unique
      this.selected = selectedId.annotationId ? (selectedId.annotationId === id) : false;
      if (this.selected && !this.isKeyboardMoving) {
        this.showToolbarSubject.next(true);
      } else {
        this.showToolbarSubject.next(false);
      }
    }
  }
  @Input() pageHeight: number;
  @Input() pageWidth: number;
  @Output() update = new EventEmitter<Annotation>();
  @Output() delete = new EventEmitter<Annotation>();
  @Output() annotationClick = new EventEmitter<SelectionAnnotation>();

  @ViewChild('container', { static: false }) container: ElementRef;
  @ViewChild('ctxToolbar', { static: false, read: ElementRef }) ctxToolbar: ElementRef<HTMLElement>;
  private lastFocusedRectangle: HTMLElement | null = null;
  private nextTabTarget: HTMLElement | null = null;

  constructor(
    private readonly toolbarEvents: ToolbarEventService,
    private store: Store<fromStore.AnnotationSetState>
  ) {
    this.showToolbarSubject
      .pipe(observeOn(asyncScheduler))
      .subscribe(show => {
        this.showToolbar = show;
      });
  }

  ngOnDestroy(): void {
    this.showToolbarSubject.complete();
  }

  private setShowToolbar(show: boolean): void {
    this.showToolbarSubject.next(show);
  }

  public onSelect() {
    const annotationId = this.anno.id || this.anno.redactionId;
    this.annotationClick.emit({ annotationId, editable: false, selected: true });

    if (!this.isKeyboardMoving) {
      this.setShowToolbar(true);
    }
  }

  public onRectangleUpdate(rectangle: Rectangle) {
    const annotation = { ...this.anno };
    annotation.rectangles = annotation.rectangles.filter(r => r.id !== rectangle.id);
    annotation.rectangles.push(rectangle);
    this.update.emit(annotation);
  }

  public deleteHighlight() {
    this.delete.emit(this.anno);
  }

  public addOrEditComment() {
    if (this.anno.comments.length === 0) {
      const comment: Comment = {
        annotationId: this.anno.id,
        content: '',
        createdBy: this.anno.createdBy,
        createdByDetails: undefined,
        createdDate: moment.utc().tz('Europe/London').toISOString(),
        id: uuid(),
        lastModifiedBy: '',
        lastModifiedByDetails: undefined,
        lastModifiedDate: '',
        tags: [],
        page: null,
        pages: {},
        pageHeight: null,
        selected: false,
        editable: false
      };
      this.store.dispatch(new fromActions.AddOrEditComment(comment));

    }
    this.selected = true;
    this.annotationClick.emit({ annotationId: this.anno.id, editable: true, selected: true });
    this.toolbarEvents.toggleCommentsPanel(true);
  }

  public onKeyboardMovingChange(isMoving: boolean): void {
    this.isKeyboardMoving = isMoving;

    if (isMoving) {
      this.showToolbar = false;
      this.showToolbarSubject.next(false);
    } else if (this.selected) {
      this.setShowToolbar(true);
    }
  }

  public onTabToToolbar(event: KeyboardEvent): void {
    if (event.shiftKey) {
      return;
    }

    const toolbarElement = this.ctxToolbar?.nativeElement;
    if (!toolbarElement) {
      return;
    }

    const firstButton = toolbarElement.querySelector('button') as HTMLElement | null;
    if (!firstButton) {
      return;
    }

    this.lastFocusedRectangle = event.target as HTMLElement;
    this.nextTabTarget = this.getNextTabTarget(this.lastFocusedRectangle);

    event.preventDefault();
    event.stopPropagation();
    firstButton.focus();
  }

  public onToolbarKeydown(event: KeyboardEvent): void {
    const toolbarElement = this.ctxToolbar?.nativeElement;
    if (!toolbarElement) {
      return;
    }

    const buttons = Array.from(toolbarElement.querySelectorAll('button')) as HTMLElement[];
    if (buttons.length === 0) {
      return;
    }

    if (event.key === 'Tab' && event.shiftKey && this.lastFocusedRectangle && event.target === buttons[0]) {
      event.preventDefault();
      event.stopPropagation();
      this.lastFocusedRectangle.focus();
      return;
    }

    if (event.key !== 'Tab' || event.shiftKey) {
      return;
    }

    const lastButton = buttons[buttons.length - 1];
    if (event.target !== lastButton) {
      return;
    }

    if (!this.nextTabTarget) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.nextTabTarget.focus();
    this.nextTabTarget = null;
  }

  private getNextTabTarget(current: HTMLElement | null): HTMLElement | null {
    if (!current || typeof document === 'undefined') {
      return null;
    }

    const ordered = Array.from(document.querySelectorAll(FOCUSABLE_SELECTOR))
      .filter(el => !(el as HTMLElement).closest('mv-ctx-toolbar'))
      .filter(el => (el as HTMLElement).getClientRects().length > 0)
      .filter(el => (el as HTMLElement).tabIndex >= 0) as HTMLElement[];

    ordered.sort((a, b) => {
      const aPositive = a.tabIndex > 0;
      const bPositive = b.tabIndex > 0;

      if (aPositive && bPositive) {
        return (a.tabIndex - b.tabIndex) || this.compareDocumentPosition(a, b);
      }

      if (aPositive) {
        return -1;
      }

      if (bPositive) {
        return 1;
      }

      return this.compareDocumentPosition(a, b);
    });
    const index = ordered.indexOf(current);
    if (index === -1) {
      return null;
    }

    return ordered[index + 1] ?? null;
  }

  private compareDocumentPosition(a: HTMLElement, b: HTMLElement): number {
    if (a === b) {
      return 0;
    }

    const position = a.compareDocumentPosition(b);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
      return -1;
    }
    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
      return 1;
    }

    return 0;
  }
}
