import {
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Injectable,
  ViewContainerRef
} from '@angular/core';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerEventService } from '../viewer-event.service';
import { BehaviorSubject } from 'rxjs';
import { AnnotationSetComponent } from '../../annotations/annotation-set/annotation-set.component';
import { PageEvent, PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import { CommentSetComponent } from '../../annotations/comment-set/comment-set.component';

@Injectable()
export class PdfAnnotationService {

  annotationSet: AnnotationSet;
  pdfWrapper: PdfJsWrapper;
  pdfViewer: ElementRef;

  pages = [];
  annotationSetComponents: ComponentRef<AnnotationSetComponent>[] = [];
  commentSetComponents: ComponentRef<CommentSetComponent>[] = [];

  highlightMode: BehaviorSubject<boolean>;
  drawMode: BehaviorSubject<boolean>;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
  ) {
    this.highlightMode = toolbarEvents.highlightMode;
    this.drawMode = toolbarEvents.drawMode;
  }

  init(pdfWrapper: PdfJsWrapper, pdfViewer: ElementRef) {
    this.pdfWrapper = pdfWrapper;
    this.pdfViewer = pdfViewer;
  }

  setupAnnotationSet(annotationSet: AnnotationSet) {
    this.destroy();
    if (annotationSet) {
      this.annotationSet = annotationSet;
      this.annotationSet.annotations.forEach(annotation => {
        if (!this.pages.includes(annotation.page)) {
          const component = this.createAnnotationSetComponent(annotation.page);
          this.pages.push(annotation.page);
          this.annotationSetComponents.push(component);
          this.setupCommentSet(annotation.page);
        }
      });
    }
  }

  setupCommentSet(page: number) {
    const component = this.createCommentSetComponent(page);
    this.pages.push(page);
    this.commentSetComponents.push(component);
  }

  destroy() {
    this.annotationSetComponents.forEach(component => component.destroy());
    this.annotationSetComponents = [];
    this.pages = [];
  }

  onPageRendered(pageRenderEvent: PageEvent) {
    const annotationComponent = this.annotationSetComponents
      .find((annotation) => annotation.instance.page === pageRenderEvent.pageNumber);
    if (annotationComponent) {
      annotationComponent.instance.initialise(pageRenderEvent.source);
    }
  }

  onPageSelected(mouseEvent: MouseEvent) {
    const pageEvent = {
      pageNumber: this.pdfWrapper.getPageNumber(),
      source: {
        rotation: this.pdfWrapper.getNormalisedPagesRotation(),
        scale: this.pdfWrapper.getCurrentPDFZoomValue(),
        div: this.pdfViewer.nativeElement
          .querySelector(`div.page[data-page-number="${this.pdfWrapper.getPageNumber()}"]`)
      }
    };

    if (this.toolbarEvents.highlightMode.getValue() || this.toolbarEvents.drawMode.getValue()) {
      const currentPage = pageEvent.pageNumber;

      if (!this.pages.includes(currentPage)) {
        this.pages.push(currentPage);
        const annotationSetComponent = this.createAnnotationSetComponent(currentPage);
        this.annotationSetComponents.push(annotationSetComponent);
        const commentSetComponent = this.createCommentSetComponent(currentPage);
        annotationSetComponent.instance.initialise(pageEvent.source);
        commentSetComponent.instance.initialise(pageEvent.source);
      }

      if (this.toolbarEvents.drawMode.getValue()) {
        setTimeout(() => {
          this.viewerEvents.onShapeSelection({
            page: this.pdfWrapper.getPageNumber(),
            event: mouseEvent
          });
        }, 0);
      }
    }
  }

  onHighlightSelected(mouseEvent: MouseEvent) {
    if (this.toolbarEvents.highlightMode.getValue()) {
      setTimeout(() => {
        this.viewerEvents.onTextSelection({
          page: this.pdfWrapper.getPageNumber(),
          event: mouseEvent
        });
      }, 0);
    }
  }

  private createAnnotationSetComponent(page: number): ComponentRef<AnnotationSetComponent> {
    const factory = this.componentFactoryResolver.resolveComponentFactory(AnnotationSetComponent);
    const component = this.viewContainerRef.createComponent(factory);
    component.instance.annotationSet = this.annotationSet;
    component.instance.page = page;
    return component;
  }

  private createCommentSetComponent(page: number): ComponentRef<CommentSetComponent> {
    const factory = this.componentFactoryResolver.resolveComponentFactory(CommentSetComponent);
    const component = this.viewContainerRef.createComponent(factory);
    component.instance.annotationSet = this.annotationSet;
    component.instance.page = page;
    return component;
  }
}
