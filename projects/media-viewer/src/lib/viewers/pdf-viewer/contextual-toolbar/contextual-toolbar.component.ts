import {Component, OnInit, ChangeDetectorRef, OnDestroy, Output, EventEmitter} from '@angular/core';
import { Subscription } from 'rxjs';
import { Annotation, Comment } from '../../../data/annotation-set.model';
import { AnnotationStoreService } from '../../../data/annotation-store.service';
import { PdfService } from '../../../data/pdf.service';
import { EmLoggerService } from '../../../logging/em-logger.service';
import { PdfRenderService } from '../../../data/pdf-render.service';

@Component({
  selector: 'app-contextual-toolbar',
  templateUrl: './contextual-toolbar.component.html',
  styleUrls: ['./contextual-toolbar.component.scss']
})
export class ContextualToolbarComponent implements OnInit, OnDestroy {

  toolPos: {left, top};
  isShowToolbar: boolean;
  showDelete: boolean;
  annotation: Annotation;
  private contextualToolBarOptions: Subscription;

  @Output() deletedAnnotation = new EventEmitter<string>();

  constructor(private annotationStoreService: AnnotationStoreService,
              private ref: ChangeDetectorRef,
              private pdfRenderService: PdfRenderService,
              private pdfService: PdfService,
              private log: EmLoggerService) {
    this.log.setClass('ContextualToolbarComponent');
    this.toolPos = {
      left: 0,
      top: 0
    };
  }

  ngOnInit() {
    this.contextualToolBarOptions = this.annotationStoreService.getToolbarUpdate()
      .subscribe(contextualOptions => {
        if (contextualOptions.annotation != null) {
          this.showToolBar(contextualOptions.annotation, contextualOptions.showDelete);
        } else {
          this.hideToolBar();
        }
      });
    this.isShowToolbar = false;
  }

  ngOnDestroy(): void {
    this.ref.detach();
    if (this.contextualToolBarOptions) {
      this.contextualToolBarOptions.unsubscribe();
    }
  }

  showToolBar(annotation: Annotation, showDelete?: boolean) {
    this.annotation = annotation;
    this.showDelete = showDelete;

    this.toolPos = this.getRelativePosition(annotation.id);
    this.isShowToolbar = true;

    if (!this.ref['destroyed']) {
      this.ref.detectChanges();
    }
  }

  getRelativePosition(annotationId: string): {left: number; top: number} {
    const svgSelector = this.pdfRenderService.getViewerElementRef().nativeElement
                          .querySelector(`g[data-pdf-annotate-id="${annotationId}"]`);
    const highlightRect = <DOMRect>svgSelector.getBoundingClientRect();

    const wrapper = this.pdfService.getAnnotationWrapper().nativeElement;
    const wrapperRect = <DOMRect>wrapper.getBoundingClientRect();

    const left = ((highlightRect.x - wrapperRect.left)
      - 175) + highlightRect.width / 2; // Minus half the toolbar width + half the length of the highlight
    const top = ((highlightRect.y - wrapperRect.top)
      - 59) - 5; // Minus height of toolbar + 5px

    return {
      left,
      top
    };
  }

  hideToolBar() {
      this.annotation = null;
      this.isShowToolbar = false;
      this.showDelete = false;

      if (!this.ref['destroyed']) {
        this.ref.detectChanges();
      }
  }

  handleCommentBtnClick() {
    if (this.annotation.comments.length === 0 ) {
        this.annotationStoreService.addComment(new Comment(null, this.annotation.id, null, null, null, null, null, null, null));
    }
    setTimeout(() => {
        const tempAnnotation = this.annotation;
        this.hideToolBar();
        this.annotationStoreService.setCommentFocusSubject(tempAnnotation, true);
        }, 10);
  }

  handleHighlightBtnClick() {
    this.hideToolBar();
  }

  async handleDeleteBtnClick() {
    await this.annotationStoreService.deleteAnnotationById(this.annotation.id, this.annotation.page);
    this.hideToolBar();
    this.deletedAnnotation.emit('deleted annotation');
  }
}
