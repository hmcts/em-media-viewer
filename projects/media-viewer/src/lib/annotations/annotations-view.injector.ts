import { ComponentFactory, ElementRef, EmbeddedViewRef, ViewContainerRef } from '@angular/core';
import { Annotation } from './annotation.model';
import { AnnotationsComponent } from './annotations.component';
import { Subject } from 'rxjs';
import { ZoomValue } from '../events/viewer-operations';

export class AnnotationsViewInjector {

  constructor(private annotationFactory: ComponentFactory<AnnotationsComponent>,
              private viewContainerRef: ViewContainerRef) {}

  addToDom(annotations: Annotation[], zoomSubject: Subject<ZoomValue>, pdfViewer: ElementRef) {
    zoomSubject.subscribe(zoom => {
      this.viewContainerRef.clear();
      const pdfViewerHtml = pdfViewer.nativeElement as HTMLElement;
      let pages = pdfViewerHtml.querySelectorAll(".page");

      if (pages.length && pages.length > 0) {
        annotations.forEach(annotation => {
          const page = pages.item(annotation.page -1);

          const annotationComponent = this.viewContainerRef.createComponent(this.annotationFactory);
          annotationComponent.instance.annotation = annotation;
          annotationComponent.instance.commentsLeftOffset = page.clientWidth + 5;
          annotationComponent.instance.zoom = zoom.value;
          annotationComponent.instance.draggable = false;
          const annotationElement = (annotationComponent.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

          page.insertBefore(annotationElement, page.firstElementChild);
        });
      }
    });
  }
}
