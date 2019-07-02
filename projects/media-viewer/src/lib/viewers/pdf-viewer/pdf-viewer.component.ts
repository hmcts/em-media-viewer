import {
  AfterContentInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EmbeddedViewRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef, ViewEncapsulation,
  OnDestroy, ComponentRef
} from '@angular/core';
import { DocumentLoadProgress, PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { AnnotationSetComponent } from '../../annotations/annotation-set/annotation-set.component';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { PrintService } from '../../print.service';
import { Subscription } from 'rxjs';
import { ViewerEventService } from '../viewer-event.service';
import uuid from 'uuid';
import {Rectangle} from '../../annotations/annotation-set/annotation/rectangle/rectangle.model';

@Component({
  selector: 'mv-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PdfViewerComponent implements AfterContentInit, OnChanges, OnDestroy {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() annotationSet: AnnotationSet | null;

  loadingDocument = false;
  loadingDocumentProgress: number;
  errorMessage: string;

  @ViewChild('viewerContainer') viewerContainer: ElementRef;
  @ViewChild('pdfViewer') pdfViewer: ElementRef;

  private pdfWrapper: PdfJsWrapper;
  private subscriptions: Subscription[] = [];
  pages = [];
  annotationSetComponents: ComponentRef<AnnotationSetComponent>[] = [];

  constructor(
    private readonly pdfJsWrapperFactory: PdfJsWrapperFactory,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly printService: PrintService,
    public readonly toolbarEvents: ToolbarEventService,
    public readonly viewerEvents: ViewerEventService,
  ) {}

  async ngAfterContentInit(): Promise<void> {
    this.pdfWrapper = this.pdfJsWrapperFactory.create(this.viewerContainer);
    this.pdfWrapper.documentLoadInit.subscribe(() => this.onDocumentLoadInit());
    this.pdfWrapper.documentLoadProgress.subscribe(v => this.onDocumentLoadProgress(v));
    this.pdfWrapper.documentLoaded.subscribe(() => this.onDocumentLoaded());
    this.pdfWrapper.documentLoadFailed.subscribe(() => this.onDocumentLoadFailed());
    this.pdfWrapper.pageRendered.subscribe((e) => this.onPageRendered(e));

    this.subscriptions.push(
      this.toolbarEvents.print.subscribe(() => this.printService.printDocumentNatively(this.url)),
      this.toolbarEvents.download.subscribe(() => this.pdfWrapper.downloadFile(this.url, this.downloadFileName)),
      this.toolbarEvents.rotate.subscribe(rotation => this.pdfWrapper.rotate(rotation)),
      this.toolbarEvents.zoom.subscribe(zoom => this.pdfWrapper.setZoom(zoom)),
      this.toolbarEvents.stepZoom.subscribe(zoom => this.pdfWrapper.stepZoom(zoom)),
      this.toolbarEvents.search.subscribe(search => this.pdfWrapper.search(search)),
      this.toolbarEvents.setCurrentPage.subscribe(pageNumber => this.pdfWrapper.setPageNumber(pageNumber)),
      this.toolbarEvents.changePageByDelta.subscribe(pageNumber => this.pdfWrapper.changePageNumber(pageNumber))
    );

    await this.pdfWrapper.loadDocument(this.url);
    this.onPageLoaded();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.url && this.pdfWrapper) {
      this.destroyAnnotationSetComponent();
      await this.pdfWrapper.loadDocument(this.url);
      this.onPageLoaded();
    }
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions that we may have
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onPageLoaded() {
    this.pages = [];
    this.annotationSet.annotations.forEach(annotation => {
      if (!this.pages.includes(annotation.page)) {
        const component = this.createAnnotationSetComponent(annotation.page);
        this.pages.push(annotation.page);
        this.annotationSetComponents.push(component);
      }
    });
  }

  onPageRendered(e: {pageNumber: number, source: {rotation: number, scale: number, div: Element}}) {
    console.log(e.pageNumber);
    const annotationComponent = this.annotationSetComponents.find((annotation) => annotation.instance.page === e.pageNumber);
    if (annotationComponent) {
      this.initialiseAnnotationSetComponent(annotationComponent, e);
    }
  }

  createAnnotationSetComponent(page: number): ComponentRef<AnnotationSetComponent> {
    const factory = this.componentFactoryResolver.resolveComponentFactory(AnnotationSetComponent);
    const component = this.viewContainerRef.createComponent(factory);
    component.instance.annotationSet = this.annotationSet;
    component.instance.page = page;
    return component;
  }

  initialiseAnnotationSetComponent(component: ComponentRef<AnnotationSetComponent>,
                               e: {pageNumber: number, source: {rotation: number, scale: number, div: Element}}) {
    component.instance.zoom = e.source.scale;
    component.instance.rotate = this.pdfWrapper.getNormalisedPagesRotation();
    component.instance.width = this.pdfWrapper.getNormalisedPagesRotation() % 180 === 0 ?
      e.source.div.clientWidth : e.source.div.clientHeight;
    component.instance.height = this.pdfWrapper.getNormalisedPagesRotation() % 180 === 0 ?
      e.source.div.clientHeight : e.source.div.clientWidth;
    const annotationsElement = (component.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    e.source.div.appendChild(annotationsElement);
  }

  destroyAnnotationSetComponent() {
    for (const annotationSet of this.annotationSetComponents) {
      annotationSet.destroy();
    }
    this.annotationSetComponents = [];
  }

  private onDocumentLoadInit() {
    this.loadingDocument = true;
    this.loadingDocumentProgress = null;
    this.errorMessage = null;
  }

  private onDocumentLoadProgress(documentLoadProgress: DocumentLoadProgress) {
    if (documentLoadProgress.total) {
      this.loadingDocumentProgress = Math.min(100, Math.ceil(documentLoadProgress.loaded / documentLoadProgress.total * 100 ));
    }
  }

  private onDocumentLoaded() {
    this.loadingDocument = false;
  }

  private onDocumentLoadFailed() {
    this.loadingDocument = false;
    this.errorMessage = `Could not load the document "${this.url}"`;
  }

  @Input()
  set searchBarHidden(hidden: boolean) {
    if (this.pdfWrapper && hidden) {
      this.pdfWrapper.clearSearch();
    }
  }

  onMouseUp(event: MouseEvent) {
    // If Highlight Mode Raise a TextSelection Event
    if (this.toolbarEvents.highlightMode.getValue()) {
      const currentPage = this.pdfWrapper.getPageNumber();
      const currentZoom = this.pdfWrapper.getCurrentPDFZoomValue();
      const currentRotation = this.pdfWrapper.getNormalisedPagesRotation();

      if (!this.pages.includes(currentPage)) {
        const component = this.createAnnotationSetComponent(currentPage);
        this.pages.push(currentPage);
        this.annotationSetComponents.push(component);
        this.initialiseAnnotationSetComponent(component, {
          pageNumber: currentPage,
          source: {
            rotation: currentRotation,
            scale: currentZoom,
            div: this.pdfViewer.nativeElement.querySelector(`div.page[data-page-number="${currentPage}"]`)
          }
        });
      }

      setTimeout(() => {
        this.viewerEvents.onTextSelection({
          page: currentPage,
          event: event
        });
      }, 0);
    }
  }
}
