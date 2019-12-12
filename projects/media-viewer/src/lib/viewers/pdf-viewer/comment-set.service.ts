import { ComponentFactoryResolver, ComponentRef, ElementRef, Injectable, ViewContainerRef } from '@angular/core';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerEventService } from '../viewer-event.service';
import { PageEvent } from './pdf-js/pdf-js-wrapper';
import { CommentSetComponent } from '../../annotations/comment-set/comment-set.component';
import { CommentService } from '../../annotations/comment-set/comment/comment.service';

@Injectable()
export class CommentSetService {

  pdfViewer: ElementRef<HTMLDivElement>;
  annotationSet: AnnotationSet;

  commentSetComponents: ComponentRef<CommentSetComponent>[] = [];

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    private readonly commentService: CommentService
  ) {
  }

  init(pdfViewer: ElementRef) {
    this.pdfViewer = pdfViewer;
  }

  setAnnotationSet(annotationSet: AnnotationSet) {
    this.annotationSet = annotationSet;
  }

  renderCommentsOnPage(pageRenderEvent: PageEvent) {
    let commentSetComponent = this.commentSetComponents
      .find((commentSetComp) => commentSetComp.instance.page === pageRenderEvent.pageNumber);
    if (commentSetComponent) {
      commentSetComponent.instance.updateView(pageRenderEvent);
    } else {
      this.addCommentSetToPage(pageRenderEvent);
    }
  }

  addCommentsToRenderedPages() {
    this.destroyCommentSetsHTML();
    if (this.pdfViewer) {
      this.pdfViewer.nativeElement.querySelectorAll('div.page')
        .forEach(page => {
          const canvasElements = page.getElementsByClassName('canvasWrapper');
          const container = page.closest('div.pageContainer');
          if (canvasElements.length > 0 && !container) {
            this.addCommentSetToPage({
              pageNumber: parseInt(page.getAttribute('data-page-number')),
              source: { div: page as HTMLDivElement, scale: 1, rotation: 0 }
            });
          }
        });
    }
  }

  private addCommentSetToPage(pageRenderEvent: PageEvent): void {
    const component = this.createCommentSetComponent(pageRenderEvent.pageNumber);
    component.instance.addToDOM(pageRenderEvent);
    this.commentSetComponents.push(component);
    this.commentService.updateCommentSets(pageRenderEvent.pageNumber, component.instance);
  }

  private createCommentSetComponent(page: number): ComponentRef<CommentSetComponent> {
    const factory = this.componentFactoryResolver.resolveComponentFactory(CommentSetComponent);
    const component = this.viewContainerRef.createComponent(factory);
    component.instance.annotationSet = this.annotationSet;
    component.instance.page = page;
    return component;
  }

  destroyComponents() {
    this.commentSetComponents.forEach(component => component.destroy());
    this.commentSetComponents = [];
  }

  destroyCommentSetsHTML() {
    if (this.pdfViewer) {
      this.pdfViewer.nativeElement.querySelectorAll('div.page')
        .forEach(page => {
          const container = page.closest('.pageContainer');
          if (container) {
            container.insertAdjacentElement('beforebegin', page);
            container.remove();
          }
        })
    }
  }
}
