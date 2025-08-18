import { DocumentLoadProgress, PageEvent, PdfJsWrapper } from './pdf-js-wrapper';
import { Subject } from 'rxjs';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer.mjs';
import * as pdfjsLib from 'pdfjs-dist';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { Outline } from '../side-bar/outline-item/outline.model';
import { PdfPosition } from '../../../store/reducers/document.reducer';
import { RefProxy } from 'pdfjs-dist/types/src/display/api';


describe('PdfJsWrapper', () => {

  let downloadManager;
  let mockViewer;
  let wrapper;
  let mockStore;
  let toolbarEventService;

  beforeEach(() => {
    downloadManager = new pdfjsViewer.DownloadManager();

    mockViewer = {
      pagesRotation: 0,
      currentPageNumber: 1,
      currentScaleValue: 2,
      eventBus: {
        on: () => {
        },
        dispatch: () => {
        }
      },
      setDocument: () => { },
      linkService: {
        setDocument: () => { },
        goToDestination: () => { }
      },
      findController: {
        executeCommand: () => { }
      }
    };

    mockStore = {
      dispatch: () => { }
    };

    const icpEventService = jasmine.createSpyObj('IcpEventService', ['confirmExit', 'leavingSession']);

    toolbarEventService = new ToolbarEventService(icpEventService);

    wrapper = new PdfJsWrapper(
      mockViewer,
      downloadManager,
      toolbarEventService,
      new Subject<string>(),
      new Subject<DocumentLoadProgress>(),
      new Subject<any>(),
      new Subject<Outline[]>(),
      new Subject(),
      new Subject<PageEvent[]>(),
      new Subject<{ location: PdfPosition }>()
    );
  });

  it('downloads a file', () => {
    const downloadSpy = spyOn(downloadManager, 'download');

    wrapper.downloadFile('http://derp.com/derp.jpg', 'derp.jpg');
    expect(downloadSpy).toHaveBeenCalledWith(null, 'http://derp.com/derp.jpg', 'derp.jpg');
  });

  it('loads a document', fakeAsync(() => {
    const pdfViewerSpy = spyOn(mockViewer, 'setDocument');
    const newDocumentLoadInitSpy = spyOn(wrapper.documentLoadInit, 'next').and.callThrough();
    const documentLoadedSpy = spyOn(wrapper.documentLoaded, 'next').and.callThrough();
    const mockDocument = { numPages: 10, getOutline: () => null, getMetadata: () => ({ info: { Title: 'Title' } }) };

    spyOn(wrapper, 'createLoadingTask')
      .and.returnValue({ promise: Promise.resolve(mockDocument) });

    wrapper.loadDocument('document-url');
    tick();

    expect(pdfViewerSpy).toHaveBeenCalledWith(mockDocument);
    expect(newDocumentLoadInitSpy).toHaveBeenCalledTimes(1);
    expect(documentLoadedSpy).toHaveBeenCalledTimes(1);
  }));

  it('loads a document with outline', fakeAsync(() => {
    const pdfViewerSpy = spyOn(mockViewer, 'setDocument');
    const newDocumentLoadInitSpy = spyOn(wrapper.documentLoadInit, 'next').and.callThrough();
    const documentLoadedSpy = spyOn(wrapper.documentLoaded, 'next').and.callThrough();
    const outlineSpy = spyOn(wrapper, 'setOutlinePageNumbers').and.callThrough();
    const outlineArray: Outline[] = [];
    const outlineItem: Outline = <Outline>{};
    outlineItem.dest = [{ num: 254, gen: 0, }, { name: 'Fit', }];
    outlineItem.items = [];
    const outline: Outline = {
      bold: true,
      color: new Uint8ClampedArray(2),
      count: 1,
      dest: [],
      italic: true,
      items: [],
      newWindow: false,
      pageNumber: 1,
      title: 'Outline',
      unsafeUrl: '',
      url: ''
    };
    outline.dest = [{ num: 254, gen: 0, }, { name: 'Fit', }];
    outline.items = [];
    outline.items.push(outlineItem);
    outlineArray.push(outline);
    const ref: RefProxy = { num: 254, gen: 0, }

    const mockDocument = { numPages: 10, getOutline: () => (outlineArray), getPageIndex: (ref) => (0), getMetadata: () => ({ info: { Title: 'Title' } }) };

    spyOn(wrapper, 'createLoadingTask')
      .and.returnValue({ promise: Promise.resolve(mockDocument) });

    wrapper.loadDocument('document-url');
    tick();

    expect(outlineSpy).toHaveBeenCalledWith(mockDocument, outlineArray);
    expect(pdfViewerSpy).toHaveBeenCalledWith(mockDocument);
    expect(newDocumentLoadInitSpy).toHaveBeenCalledTimes(1);
    expect(documentLoadedSpy).toHaveBeenCalledTimes(1);
  }));

  it('loads a document with exception', fakeAsync(() => {
    const pdfViewerSpy = spyOn(mockViewer, 'setDocument');
    const newDocumentLoadInitSpy = spyOn(wrapper.documentLoadInit, 'next').and.callThrough();
    const documentLoadedSpy = spyOn(wrapper.documentLoaded, 'next').and.callThrough();
    const documentLoadFailedSpy = spyOn(wrapper.documentLoadFailed, 'next').and.callThrough();
    spyOn(wrapper, 'createLoadingTask').and.returnValue({ promise: Promise.reject(new Error('x')) });

    wrapper.loadDocument('document-url');
    tick();

    expect(pdfViewerSpy).not.toHaveBeenCalled();
    expect(newDocumentLoadInitSpy).toHaveBeenCalledTimes(1);
    expect(documentLoadedSpy).not.toHaveBeenCalled();
    expect(documentLoadFailedSpy).toHaveBeenCalledTimes(1);
  }));

  it('should perform rotate operation', () => {
    mockViewer.pagesRotation = 0;
    wrapper.rotate(90);

    expect(mockViewer.pagesRotation).toEqual(90);
  });

  it('should set the zoomValue only if the zoom name includes XYZ', () => {
    const navigateSpy = spyOn(mockViewer.linkService, 'goToDestination');
    const destination = [];
    destination[1] = { name: 'XYZ' };
    wrapper.navigateTo(destination);

    expect(destination[4]).toEqual(1);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should populate the destination object if the zoom name does not include XYZ', () => {
    const navigateSpy = spyOn(mockViewer.linkService, 'goToDestination');
    const destination = [];
    destination[1] = { name: 'FitH' };
    wrapper.navigateTo(destination);

    expect(destination[2]).toEqual(null);
    expect(destination[3]).toEqual(null);
    expect(destination[4]).toEqual(1);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should not alter the destination if it is not of type object', () => {
    const navigateSpy = spyOn(mockViewer.linkService, 'goToDestination');
    const destination = 1234;
    wrapper.navigateTo(destination);

    expect(destination).toEqual(1234);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should perform zoom operation', () => {
    mockViewer.currentScaleValue = 1;
    wrapper.setZoom(2);

    expect(mockViewer.currentScaleValue).toEqual('2');
  });

  it('should set scale value to max value', () => {
    mockViewer.currentScaleValue = 1;
    wrapper.setZoom(6);

    expect(mockViewer.currentScaleValue).toEqual('5');
  });

  it('should set scale value to min value', () => {
    mockViewer.currentScaleValue = 1;
    wrapper.setZoom(0.001);

    expect(mockViewer.currentScaleValue).toEqual('0.1');
  });

  it('should set scale value to this.zoomValue', () => {
    mockViewer.currentScaleValue = 1;
    wrapper.setZoom(NaN);

    expect(mockViewer.currentScaleValue).toEqual('1');
  });

  it('should step the zoom', () => {
    mockViewer.currentScaleValue = 1;
    wrapper.stepZoom(0.5);

    expect(mockViewer.currentScaleValue).toEqual('1.5');
  });

  it('should call the search operation', () => {
    spyOn(mockViewer.eventBus, 'dispatch');

    const searchOperation = {
      searchTerm: 'searchTerm',
      highlightAll: false,
      matchCase: false,
      wholeWord: false,
      previous: false,
      reset: false
    };
    wrapper.search(searchOperation);

    expect(mockViewer.eventBus.dispatch).toHaveBeenCalledWith('find', {
      source: mockViewer,
      type: 'again',
      query: 'searchTerm',
      phraseSearch: true,
      caseSensitive: false,
      entireWord: false,
      highlightAll: false,
      findPrevious: false
    });
  });

  it('clear the search when the search bar is closed', () => {
    spyOn(mockViewer.eventBus, 'dispatch');

    wrapper.clearSearch();

    expect(mockViewer.eventBus.dispatch).toHaveBeenCalled();
  });

  it('should set the current page', () => {
    mockViewer.currentPageNumber = 1;
    wrapper.setPageNumber(2);
    expect(mockViewer.currentPageNumber).toEqual(2);
  });

  it('should change the current page', () => {
    mockViewer.currentPageNumber = 1;
    wrapper.changePageNumber(-2);
    expect(mockViewer.currentPageNumber).toEqual(-1);
  });

  it('should set the current pdf document title', () => {
    wrapper.documentTitle = 'Document Title';
    wrapper.setCurrentPDFTitle('New Bundle');

    expect(wrapper.documentTitle).toEqual('New Bundle');
  });

  it('should get the current pdf document title', () => {
    wrapper.documentTitle = 'Document Title';
    expect(wrapper.getCurrentPDFTitle()).toEqual('Document Title');
  });

  it('dispatch updatefindcontrolstate', () => {

    const searchResultsCountSubjectNext = spyOn(toolbarEventService.searchResultsCountSubject, 'next').and.callThrough();
    const redactionSerachSubjectNext = spyOn(toolbarEventService.redactionSerachSubject, 'next').and.callThrough();
    wrapper.sendSearchDetails({
      state: 0,
      matchesCount: { total: 1 },
      source: {
        selected:
          { pageIdx: 1, matchIdx: 1 },
      }
    });

    expect(searchResultsCountSubjectNext).toHaveBeenCalled();
    expect(redactionSerachSubjectNext).toHaveBeenCalled();
  });
});

describe('drawMissingPages', () => {
  let wrapper: PdfJsWrapper;
  let mockPdfViewer: any;

  beforeEach(() => {
    mockPdfViewer = {
      _pages: [],
      eventBus: { on: () => {}, dispatch: () => {} }
    };
    wrapper = new PdfJsWrapper(
      mockPdfViewer,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any
    );
    spyOn(console, 'log');
  });

  it('should return early if previousPageNumber is not set', () => {
    const event = { pageNumber: 5, previous: undefined };
    expect(() => wrapper.drawMissingPages(event)).not.toThrow();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should return early if pageNumber < previousPageNumber', () => {
    const event = { pageNumber: 2, previous: 5 };
    expect(() => wrapper.drawMissingPages(event)).not.toThrow();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should return early if pageDelta <= 1', () => {
    const event = { pageNumber: 6, previous: 5 };
    expect(() => wrapper.drawMissingPages(event)).not.toThrow();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should call draw on missing pages when skipping forward', () => {
    const page3 = { renderingState: null, draw: jasmine.createSpy('draw') };
    const page4 = { renderingState: null, draw: jasmine.createSpy('draw') };
    mockPdfViewer._pages = [null, null, page3, page4];
    const event = { pageNumber: 5, previous: 2 };
    wrapper.drawMissingPages(event);
    expect(console.log).toHaveBeenCalledWith('User has skipped pages, rendering missing pages from', 3, 'to', 5);
    expect(page3.draw).toHaveBeenCalled();
    expect(page4.draw).toHaveBeenCalled();
  });

  it('should skip pages that already have renderingState', () => {
    const page3 = { renderingState: 'FINISHED', draw: jasmine.createSpy('draw') };
    mockPdfViewer._pages = [null, null, page3];
    const event = { pageNumber: 4, previous: 2 };
    wrapper.drawMissingPages(event);
    expect(page3.draw).not.toHaveBeenCalled();
  });
});