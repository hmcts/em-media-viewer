import { getPages } from './../../store/selectors/document.selectors';
import { Rotation } from './../rotation-persist/rotation.model';
import { RpxTranslationModule } from 'rpx-xui-translation';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Subject } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';

import { PdfViewerComponent } from './pdf-viewer.component';
import { PdfJsWrapperFactory } from './pdf-js/pdf-js-wrapper.provider';
import { annotationSet } from '../../../assets/annotation-set';
import { PrintService } from '../../print.service';
import { AnnotationSetComponent } from '../../annotations/annotation-set/annotation-set.component';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { DocumentLoadProgress } from './pdf-js/pdf-js-wrapper';
import { ViewerEventService } from '../viewer-event.service';
import { CommentService } from '../../annotations/comment-set/comment/comment.service';
import { GrabNDragDirective } from '../grab-n-drag.directive';
import { Outline } from './side-bar/outline-item/outline.model';
import { PdfPosition, reducers } from '../../store/reducers/reducers';
import { PdfPositionUpdate } from '../../store/actions/document.actions';
import { IcpService } from '../../icp/icp.service';
import { SetCaseId } from '../../store/actions/icp.actions';
import { IcpEventService } from '../../toolbar/icp-event.service';

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
        StoreModule.forRoot({}),
        RpxTranslationModule.forRoot({
          baseUrl: '',
          debounceTimeMs: 300,
          validity: {
            days: 1
          },
          testMode: true
        })
      ],
      providers: [
        CommentService,
        ToolbarEventService,
        ViewerEventService,
        IcpEventService,
        PrintService,
        PdfJsWrapperFactory,
        { provide: IcpService, useValue: mockIcpService },
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    mockWrapper = {
      loadDocument: () => { },
      search: () => { },
      clearSearch: () => { },
      rotate: () => { },
      setZoom: () => { },
      stepZoom: () => { },
      downloadFile: () => { },
      setPageNumber: () => { },
      changePageNumber: () => { },
      getPageNumber: () => { },
      getCurrentPDFTitle: () => { },
      navigateTo: () => { },
      documentLoadInit: new Subject<any>(),
      documentLoadProgress: new Subject<DocumentLoadProgress>(),
      documentLoaded: new Subject<any>(),
      outlineLoaded: new Subject<Outline>(),
      documentLoadFailed: new Subject(),
      pageRendered: new Subject<{ pageNumber: number, source: { rotation: number, scale: number, div: Element } }>(),
      positionUpdated: new Subject<{ location: PdfPosition }>()
    };
    component.annotationSet = JSON.parse(JSON.stringify(annotationSet));
    component.url = 'url';
    toolbarEvents = fixture.debugElement.injector.get(ToolbarEventService);
    printService = fixture.debugElement.injector.get(PrintService);
    viewerEvents = fixture.debugElement.injector.get(ViewerEventService);
    wrapperFactory = fixture.debugElement.injector.get(PdfJsWrapperFactory);
    icpService = TestBed.inject(IcpService);
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

  it('should setup subscriptions', inject([Store], (store) => {
    spyOn(printService, 'printDocumentNatively');
    spyOn(toolbarEvents, 'toggleCommentsPanel');
    spyOnAllFunctions(mockWrapper);
    spyOn(store, 'dispatch');

    const mockSearchOperation = {
      searchTerm: 'searchTerm',
      highlightAll: false,
      matchCase: false,
      wholeWord: false,
      previous: false,
      reset: true
    };

    toolbarEvents.printSubject.next();
    toolbarEvents.downloadSubject.next();
    toolbarEvents.zoomSubject.next(0.2);
    toolbarEvents.stepZoomSubject.next(0.2);
    toolbarEvents.searchSubject.next(mockSearchOperation);
    toolbarEvents.setCurrentPageSubject.next(0);
    toolbarEvents.changePageByDeltaSubject.next(0);
    mockWrapper.positionUpdated.next({ location: { pageNumber: 1, top: 10, left: 10, rotation: 0, scale: 1 } });

    expect(printService.printDocumentNatively).toHaveBeenCalledWith(component.url);
    expect(mockWrapper.downloadFile).toHaveBeenCalled();
    expect(mockWrapper.setZoom).toHaveBeenCalled();
    expect(mockWrapper.stepZoom).toHaveBeenCalled();
    expect(mockWrapper.search).toHaveBeenCalled();
    expect(mockWrapper.setPageNumber).toHaveBeenCalled();
    expect(mockWrapper.changePageNumber).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new PdfPositionUpdate({ pageNumber: 1, top: 10, left: 10, rotation: 0, scale: 1 }));
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

    mockWrapper.documentLoadFailed.next({ name: 'error', message: 'Could not load the document' });

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

    toolbarEvents.toggleParticipantsList(true);
    fixture.detectChanges();

    expect(component.showIcpParticipantsList).toBeTruthy();
    expect(component.viewerContainer.nativeElement.classList).toContain('show-comments-panel');
  });

  it('should hide icp participants list', () => {
    component.showIcpParticipantsList = true;
    component.showCommentsPanel = false;

    toolbarEvents.toggleParticipantsList(false);
    fixture.detectChanges();

    expect(component.showIcpParticipantsList).toBeFalsy();
    expect(component.viewerContainer.nativeElement.classList).not.toContain('show-comments-panel');
  });

  it('should emit toggleCommentsSummary event', () => {
    const commentSummarySpy = spyOn(component.toolbarEvents.showCommentSummary, 'next');
    component.toggleCommentsSummary();
    expect(commentSummarySpy).toHaveBeenCalledWith(true);
  });

  it('should call set case id action when case id is set',
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

  it('calls goToDestination', inject([Store], fakeAsync((store) => {
    spyOn(mockWrapper, 'navigateTo');
    spyOn(mockWrapper, 'getPageNumber');
    spyOn(mockWrapper, 'setPageNumber');
    component.rotation = 270;

    viewerEvents.navigationEvent.next([{ pageNumber: 1, top: 10, left: 10, rotation: 270, scale: 1 }]);
    tick(10);
    expect(mockWrapper.navigateTo).toHaveBeenCalled();
    expect(component.rotation).toEqual(270);
    expect(mockWrapper.getPageNumber).toHaveBeenCalledTimes(2);
    expect(mockWrapper.setPageNumber).toHaveBeenCalledTimes(2);
  })));

  it('call calculateZoomValue where the new zoom will be 5', inject([Store], (store) => {
    var result = component.calculateZoomValue(2, 4);
    expect(result).toEqual(5);
  }));

  it('call calculateZoomValue where the new zoom will be 0.5', inject([Store], (store) => {
    var result = component.calculateZoomValue(0.01, 0.05);
    expect(result).toEqual(0.1);
  }));

});
