import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { PdfViewerComponent } from './pdf-viewer.component';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import { annotationSet } from '../../../assets/annotation-set';
import { PrintService } from '../../print.service';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { AnnotationSetComponent } from '../../annotations/annotation-set/annotation-set.component';
import { AnnotationApiService } from '../../annotations/annotation-api.service';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { DocumentLoadProgress } from './pdf-js/pdf-js-wrapper';
import { ViewerEventService } from '../viewer-event.service';

import { CommentService } from '../../annotations/comment-set/comment/comment.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HighlightCreateService } from '../../annotations/annotation-set/annotation-create/highlight-create.service';
import { GrabNDragDirective } from '../grab-n-drag.directive';
import { Outline } from './side-bar/outline-item/outline.model';
import { Store, StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers/reducers';
import { SelectedAnnotation } from '../../store/actions/annotations.action';
import { PdfPosition } from './side-bar/bookmarks/bookmarks.interfaces';
import { PdfPositionUpdate } from '../../store/actions/document.action';
import { IcpService } from '../../icp/icp.service';
import { SetCaseId } from '../../store/actions/icp.action';

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;
  let toolbarEvents: ToolbarEventService;
  let printService: PrintService;
  let viewerEvents: ViewerEventService;
  let wrapperFactory: PdfJsWrapperFactory;
  let icpService: IcpService;
  let mockWrapper: any;

  const mockIcpService = {
    setUp: () => {
    }
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PdfViewerComponent,
        AnnotationSetComponent,
        GrabNDragDirective
      ],
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      providers: [
        AnnotationApiService,
        CommentService,
        ToolbarEventService,
        ViewerEventService,
        PrintService,
        PdfJsWrapperFactory,
        HighlightCreateService,
        { provide: IcpService, useValue: mockIcpService },
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
      getCurrentPDFTitle: () => {},
      documentLoadInit: new Subject<any>(),
      documentLoadProgress: new Subject<DocumentLoadProgress>(),
      documentLoaded: new Subject<any>(),
      outlineLoaded: new Subject<Outline>(),
      documentLoadFailed: new Subject(),
      pageRendered: new Subject<{pageNumber: number, source: { rotation: number, scale: number, div: Element} }>(),
      positionUpdated: new Subject<{ location: PdfPosition }>()
    };
    component.annotationSet = JSON.parse(JSON.stringify(annotationSet)) ;
    component.url = 'url';
    toolbarEvents = fixture.debugElement.injector.get(ToolbarEventService);
    printService = fixture.debugElement.injector.get(PrintService);
    viewerEvents = fixture.debugElement.injector.get(ViewerEventService);
    wrapperFactory = fixture.debugElement.injector.get(PdfJsWrapperFactory);
    icpService = TestBed.get(IcpService);
    spyOn(wrapperFactory, 'create').and.returnValue(mockWrapper);
    component.ngOnChanges({
      url: new SimpleChange(null, component.url, true)
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should setup subscriptions', inject([Store],(store) => {
    spyOn(printService, 'printDocumentNatively');
    spyOn(toolbarEvents, 'toggleCommentsPanel');
    spyOnAllFunctions(mockWrapper);
    spyOn(store, 'dispatch');

    toolbarEvents.printSubject.next();
    toolbarEvents.downloadSubject.next();
    toolbarEvents.zoomSubject.next(0.2);
    toolbarEvents.stepZoomSubject.next(0.2);
    toolbarEvents.searchSubject.next();
    toolbarEvents.setCurrentPageSubject.next();
    toolbarEvents.changePageByDeltaSubject.next();
    mockWrapper.positionUpdated.next({ location: { pageNumber: 1, top: 10, left: 10, rotation: 0 }});

    expect(printService.printDocumentNatively).toHaveBeenCalledWith(component.url);
    expect(mockWrapper.downloadFile).toHaveBeenCalled();
    expect(mockWrapper.setZoom).toHaveBeenCalled();
    expect(mockWrapper.stepZoom).toHaveBeenCalled();
    expect(mockWrapper.search).toHaveBeenCalled();
    expect(mockWrapper.setPageNumber).toHaveBeenCalled();
    expect(mockWrapper.changePageNumber).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new PdfPositionUpdate({ pageNumber: 1, top: 10, left: 10, rotation: 0 }));
  }));

  it('on DocumentLoadProgress indicate document loading progress', () => {
    mockWrapper.documentLoadProgress.next({ loaded: 10, total: 100 });
    expect(component.loadingDocumentProgress).toBe(10);

    mockWrapper.documentLoadProgress.next({ loaded: 90, total: 100 });
    expect(component.loadingDocumentProgress).toBe(90);

    mockWrapper.documentLoadProgress.next({ loaded: 200, total: 100 });
    expect(component.loadingDocumentProgress).toBe(100);
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

  // it('should not highlight text when in view mode for selected page', () => {
  //   const mouseEvent = { target: { offsetParent: { offsetParent: { getAttribute: () => 1 }} } } as any;
  //   spyOn(toolbarEvents.highlightModeSubject, 'getValue').and.returnValue(false);
  //   spyOn(viewerEvents, 'textSelected');
  //
  //   component.onMouseUp(mouseEvent);
  //
  //   expect(viewerEvents.textSelected).not.toHaveBeenCalled();
  // });

  // it('should deselect annotation and context toolbar',
  //   inject([Store], (store) => {
  //     spyOn(store, 'dispatch');
  //     spyOn(viewerEvents, 'clearCtxToolbar');
  //
  //     component.onPdfViewerClick();
  //
  //     expect(store.dispatch).toHaveBeenCalledWith(new SelectedAnnotation({
  //       annotationId: '', selected: false, editable: false
  //     }));
  //     expect(viewerEvents.clearCtxToolbar).toHaveBeenCalled()
  // }));

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

  it('should set document loading status to false after document load failed', () => {
    component.loadingDocument = true;

    mockWrapper.documentLoadFailed.next({ name: 'error', message: 'Could not load the document'});

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

  it('should show comments panel', () => {
    component.showCommentsPanel = false;
    component.showIcpParticipantsList = false;

    toolbarEvents.commentsPanelVisible.next(true);
    fixture.detectChanges();

    expect(component.showCommentsPanel).toBeTruthy();
    expect(component.viewerContainer.nativeElement.classList).toContain('show-comments-panel');
  });

  it('should hide comments panel', () => {
    component.showCommentsPanel = true;
    component.showIcpParticipantsList = false;

    toolbarEvents.commentsPanelVisible.next(false);
    fixture.detectChanges();

    expect(component.showCommentsPanel).toBeFalsy();
    expect(component.viewerContainer.nativeElement.classList).not.toContain('show-comments-panel');
  });

  it('should show icp participants list', () => {
    component.showIcpParticipantsList = false;
    component.showCommentsPanel = false;

    toolbarEvents.icp.participantsListVisible.next(true);
    fixture.detectChanges();

    expect(component.showIcpParticipantsList).toBeTruthy();
    expect(component.viewerContainer.nativeElement.classList).toContain('show-comments-panel');
  });

  it('should hide icp participants list', () => {
    component.showIcpParticipantsList = true;
    component.showCommentsPanel = false;

    toolbarEvents.icp.participantsListVisible.next(false);
    fixture.detectChanges();

    expect(component.showIcpParticipantsList).toBeFalsy();
    expect(component.viewerContainer.nativeElement.classList).not.toContain('show-comments-panel');
  });

  it('should emit toggleCommentsSummary event', () => {
    const commentSummarySpy = spyOn(component.toolbarEvents.showCommentSummary, 'next');
    component.toggleCommentsSummary();
    expect(commentSummarySpy).toHaveBeenCalledWith(true);
  });

  it('Should call set case id action when case id is set',
    inject([Store], fakeAsync((store) => {
      spyOn(store, 'dispatch');

      const caseId = 'caseId';
      component.caseId = caseId;
      component.ngOnChanges({
        caseId: new SimpleChange(null, component.caseId, true)
      });

      expect(store.dispatch).toHaveBeenCalledWith(new SetCaseId(caseId));
    }))
  );
});
