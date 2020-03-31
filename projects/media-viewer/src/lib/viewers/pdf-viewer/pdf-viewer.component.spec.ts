import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { PdfViewerComponent } from './pdf-viewer.component';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import { annotationSet } from '../../../assets/annotation-set';
import { PrintService } from '../../print.service';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ErrorMessageComponent } from '../error-message/error.message.component';
import { By } from '@angular/platform-browser';
import { AnnotationSetComponent } from '../../annotations/annotation-set/annotation-set.component';
import { AnnotationApiService } from '../../annotations/annotation-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { DocumentLoadProgress } from './pdf-js/pdf-js-wrapper';
import { ViewerEventService } from '../viewer-event.service';

import { CommentService } from '../../annotations/comment-set/comment/comment.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BoxHighlightCreateService } from '../../annotations/annotation-set/annotation-create/box-highlight-create.service';
import { TextHighlightCreateService } from '../../annotations/annotation-set/annotation-create/text-highlight-create.service';

import { GrabNDragDirective } from '../grab-n-drag.directive';
import { Outline } from './outline-view/outline.model';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../store/reducers';

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;
  let toolbarEvents: ToolbarEventService;
  let printService: PrintService;
  let viewerEvents: ViewerEventService;
  let wrapperFactory: PdfJsWrapperFactory;
  let annotationsDestroyed: boolean;
  let mockWrapper: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PdfViewerComponent,
        ErrorMessageComponent,
        AnnotationSetComponent,
        GrabNDragDirective
      ],
      imports: [HttpClientTestingModule, StoreModule.forRoot({...reducers})],
      providers: [
        AnnotationApiService,
        CommentService,
        ToolbarEventService,
        ViewerEventService,
        PrintService,
        PdfJsWrapperFactory,
        BoxHighlightCreateService,
        TextHighlightCreateService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [AnnotationSetComponent]
        }
      })
      .compileComponents();
    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    mockWrapper = {
      loadDocument: () => {},
      search: () => {},
      clearSearch: () => {},
      rotate: () => {},
      setZoom: () => {},
      stepZoom: () => {},
      downloadFile: () => {},
      setPageNumber: () => {},
      changePageNumber: () => {},
      getPageNumber: () => {},
      getCurrentPDFZoomValue: () => {},
      getNormalisedPagesRotation: () => 0,
      getCurrentPDFTitle: () => {},
      documentLoadInit: new Subject<any>(),
      documentLoadProgress: new Subject<DocumentLoadProgress>(),
      documentLoaded: new Subject<any>(),
      outlineLoaded: new Subject<Outline>(),
      documentLoadFailed: new Subject(),
      pageRendered: new Subject<{pageNumber: number, source: { rotation: number, scale: number, div: Element} }>()
    };
    component.annotationSet = JSON.parse(JSON.stringify(annotationSet)) ;
    component.url = 'url';
    toolbarEvents = fixture.debugElement.injector.get(ToolbarEventService);
    printService = fixture.debugElement.injector.get(PrintService);
    viewerEvents = fixture.debugElement.injector.get(ViewerEventService);
    wrapperFactory = fixture.debugElement.injector.get(PdfJsWrapperFactory);
    spyOn(wrapperFactory, 'create').and.returnValue(mockWrapper);
    component.ngOnChanges({
      url: new SimpleChange(null, component.url, true)
    });
    component.ngAfterContentInit();
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should setup subscriptions', () => {
    spyOn(printService, 'printDocumentNatively');
    spyOn(viewerEvents, 'toggleCommentsPanel');
    spyOnAllFunctions(mockWrapper);

    toolbarEvents.printSubject.next();
    toolbarEvents.downloadSubject.next();
    toolbarEvents.zoomSubject.next(0.2);
    toolbarEvents.stepZoomSubject.next(0.2);
    toolbarEvents.searchSubject.next();
    toolbarEvents.setCurrentPageSubject.next();
    toolbarEvents.changePageByDeltaSubject.next();

    expect(printService.printDocumentNatively).toHaveBeenCalledWith(component.url);
    expect(mockWrapper.downloadFile).toHaveBeenCalled();
    expect(mockWrapper.setZoom).toHaveBeenCalled();
    expect(mockWrapper.stepZoom).toHaveBeenCalled();
    expect(mockWrapper.search).toHaveBeenCalled();
    expect(mockWrapper.setPageNumber).toHaveBeenCalled();
    expect(mockWrapper.changePageNumber).toHaveBeenCalled();
  });

  it('on DocumentLoadProgress indicate document loading progress', () => {
    mockWrapper.documentLoadProgress.next({ loaded: 10, total: 100 });
    expect(component.loadingDocumentProgress).toBe(10);

    mockWrapper.documentLoadProgress.next({ loaded: 90, total: 100 });
    expect(component.loadingDocumentProgress).toBe(90);

    mockWrapper.documentLoadProgress.next({ loaded: 200, total: 100 });
    expect(component.loadingDocumentProgress).toBe(100);
  });

  it('should show error message when errorMessage is set', () => {
    const pdfContainerHtml = fixture.debugElement.query(By.css('.pdfContainer')).nativeElement;

    expect(pdfContainerHtml.className).not.toContain('hidden');
    expect(fixture.debugElement.query(By.directive(ErrorMessageComponent))).toBeNull();

    component.errorMessage = 'errorx';
    fixture.detectChanges();

    expect(pdfContainerHtml.className).toContain('hidden');
    expect(fixture.debugElement.query(By.directive(ErrorMessageComponent))).toBeTruthy();
  });

  it('should show error message on document load failed', () => {
    mockWrapper.documentLoadFailed.next({ name: 'error', message: 'Could not load the document' });

    expect(component.errorMessage).toContain('Could not load the document');
    expect(component.loadingDocument).toBe(false);
  });

  it('clear the search when the search bar is closed', () => {
    spyOn(mockWrapper, 'clearSearch');

    component.searchBarHidden = true;

    expect(mockWrapper.clearSearch).toHaveBeenCalled();
  });

  it('should not highlight text when in view mode for selected page', () => {
    const mouseEvent = new MouseEvent('mouseup');
    spyOn(toolbarEvents.highlightModeSubject, 'getValue').and.returnValue(false);
    spyOn(viewerEvents, 'textSelected');

    component.onMouseUp(mouseEvent);

    expect(viewerEvents.textSelected).not.toHaveBeenCalled();
  });

  it('should initialize loading of document', () => {
    mockWrapper.documentLoadInit.next();

    expect(component.loadingDocument).toBe(true);
    expect(component.loadingDocumentProgress).toBe(null);
    expect(component.errorMessage).toBe(null);
  });

  it('should set document loading status to false after document has been loaded', () => {
    component.loadingDocument = true;

    mockWrapper.documentLoaded.next();

    expect(component.loadingDocument).toBe(false);
  });

  it('should load new document when URL changes', fakeAsync(() => {
    component.enableAnnotations = true;
    component.annotationSet = JSON.parse(JSON.stringify(annotationSet));
    spyOn(mockWrapper, 'loadDocument');

    component.ngOnChanges({
      url: new SimpleChange('a', component.url, true)
    });
    tick();

    expect(mockWrapper.loadDocument).toHaveBeenCalled();
  }));

  it('should emit documentTitle when document is loaded', fakeAsync(() => {
    const documentTitleSpy = spyOn(component.documentTitle, 'emit');
    component.url = 'b';

    component.ngOnChanges({
      url: new SimpleChange('a', component.url, true)
    });
    tick();

    expect(documentTitleSpy).toHaveBeenCalled();
  }));

  it('should load new document when annotations enabled', fakeAsync(() => {
    annotationsDestroyed = false;
    component.enableAnnotations = true;

    component.ngOnChanges({
      enableAnnotations: new SimpleChange(false, true, false)
    });
    tick();

    expect(annotationsDestroyed).toBeFalsy();
  }));


  it('should show comments panel', () => {
    component.showCommentsPanel = false;

    viewerEvents.commentsPanelVisible.next(true);
    fixture.detectChanges();

    expect(component.showCommentsPanel).toBeTruthy();
    expect(component.viewerContainer.nativeElement.classList).toContain('show-comments-panel');
  });

  it('should hide comments panel', () => {
    component.showCommentsPanel = true;

    viewerEvents.commentsPanelVisible.next(false);

    expect(component.showCommentsPanel).toBeFalsy();
    expect(component.viewerContainer.nativeElement.classList).not.toContain('show-comments-panel');
  });

  it('should emit toggleCommentsSummary event', () => {
    const commentSummarySpy = spyOn(component.toolbarEvents.showCommentSummary, 'next');
    component.toggleCommentsSummary();
    expect(commentSummarySpy).toHaveBeenCalledWith(true);
  });

});
