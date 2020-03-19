import { ComponentFactoryResolver, ComponentRef, ElementRef, Injectable, ViewContainerRef } from '@angular/core';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { AnnotationSetComponent } from '../../annotations/annotation-set/annotation-set.component';
import { PageEvent, PdfJsWrapper } from './pdf-js/pdf-js-wrapper';

@Injectable()
export class AnnotationSetService {

  pdfWrapper: PdfJsWrapper;
  pdfViewer: ElementRef<HTMLDivElement>;
  annotationSet: AnnotationSet;

  pages: number[] = [];
  annotationSetComponents: ComponentRef<AnnotationSetComponent>[] = [];

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  init(pdfWrapper: PdfJsWrapper, pdfViewer: ElementRef) {
    this.pdfWrapper = pdfWrapper;
    this.pdfViewer = pdfViewer;
  }

  setAnnotationSet(annotationSet: AnnotationSet) {
    this.annotationSet = annotationSet;
  }

  buildAnnoSetComponents() {
    if (this.annotationSet) {
      this.annotationSet.annotations.forEach(annotation => {
        if (!this.pages.includes(annotation.page)) {
          const component = this.createAnnotationSetComponent(annotation.page);
          this.pages.push(annotation.page);
          this.annotationSetComponents.push(component);
        }
      });
    }
  }

  private createAnnotationSetComponent(page: number): ComponentRef<AnnotationSetComponent> {
    const factory = this.componentFactoryResolver.resolveComponentFactory(AnnotationSetComponent);
    const component = this.viewContainerRef.createComponent(factory);
    component.instance.annotationSet = this.annotationSet;
    component.instance.page = page;
    return component;
  }

  destroyComponents() {
    this.annotationSetComponents.forEach(component => component.destroy());
    this.annotationSetComponents = [];
    this.pages = [];
  }
}
