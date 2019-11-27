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
import { CommentService } from '../../annotations/comment-set/comment/comment.service';

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
    private readonly commentService: CommentService
  ) {
    this.highlightMode = toolbarEvents.highlightModeSubject;
    this.drawMode = toolbarEvents.drawModeSubject;
  }

  init(pdfWrapper: PdfJsWrapper, pdfViewer: ElementRef) {
    this.pdfWrapper = pdfWrapper;
    this.pdfViewer = pdfViewer;
  }

  setupAnnotationSet(annotationSet: AnnotationSet) {
    this.destroyComponents();
    if (annotationSet) {
      this.annotationSet = annotationSet;
      this.annotationSet.annotations.forEach(annotation => {
        if (!this.pages.includes(annotation.page)) {
          const component = this.createAnnotationSetComponent(annotation.page);
          this.pages.push(annotation.page);
          this.annotationSetComponents.push(component);
        }
      });
    }
  }

  setupCommentSet(page: number): ComponentRef<CommentSetComponent> {
    const component = this.createCommentSetComponent(page);
    this.commentSetComponents.push(component);
    return component;
  }

  destroyComponents() {
    this.annotationSetComponents.forEach(component => component.destroy());
    this.commentSetComponents.forEach(component => component.destroy());
    this.annotationSetComponents = [];
    this.commentSetComponents = [];
    this.pages = [];
  }

  onPageRendered(pageRenderEvent: PageEvent) {
    this.annotationSetComponents
      .filter(annotation => annotation.instance.page === pageRenderEvent.pageNumber)
      .forEach(annotationSetComponent => annotationSetComponent.instance.addToDOM(pageRenderEvent.source));

    let commentSetComponent = this.commentSetComponents
      .find((commentSet) => commentSet.instance.page === pageRenderEvent.pageNumber);
    if (commentSetComponent) {
      commentSetComponent.instance.setCommentSetValues(pageRenderEvent.source);
    } else {
      commentSetComponent = this.setupCommentSet(pageRenderEvent.pageNumber);
      commentSetComponent.instance.addToDOM(pageRenderEvent.source);
    }
    this.commentService.updateCommentSets(pageRenderEvent.pageNumber, commentSetComponent.instance);
  }

  onShapeHighlighted(mouseEvent: MouseEvent) {
    if (this.toolbarEvents.highlightModeSubject.getValue() || this.toolbarEvents.drawModeSubject.getValue()) {
      const pageNumber = this.pdfWrapper.getPageNumber();
      if (!this.pages.includes(pageNumber)) {

        this.pages.push(pageNumber);
        const annotationSetComponent = this.createAnnotationSetComponent(pageNumber);
        this.annotationSetComponents.push(annotationSetComponent);

        annotationSetComponent.instance.addToDOM({
          rotation: this.pdfWrapper.getNormalisedPagesRotation(),
          scale: this.pdfWrapper.getCurrentPDFZoomValue(),
          div: this.pdfViewer.nativeElement
            .querySelector(`div.page[data-page-number="${this.pdfWrapper.getPageNumber()}"]`)
        });
      }

      if (this.toolbarEvents.drawModeSubject.getValue()) {
        setTimeout(() => {
          this.viewerEvents.onShapeSelection({
            page: this.pdfWrapper.getPageNumber(),
            event: mouseEvent
          });
        }, 0);
      }
    }
  }

  onTextHighlighted(mouseEvent: MouseEvent) {
    if (this.toolbarEvents.highlightModeSubject.getValue()) {
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
