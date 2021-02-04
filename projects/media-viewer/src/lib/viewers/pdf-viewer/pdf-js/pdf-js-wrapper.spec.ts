import { DocumentLoadProgress, PageEvent, PdfJsWrapper } from './pdf-js-wrapper';
import { Subject } from 'rxjs';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import * as pdfjsLib from 'pdfjs-dist';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { Outline } from '../side-bar/outline-item/outline.model';
import { PdfPosition } from '../../../store/reducers/document.reducer';

describe('PdfJsWrapper', () => {

  let downloadManager;
  let mockViewer;
  let wrapper;
  let mockStore;

  beforeEach(() => {
    downloadManager = new pdfjsViewer.DownloadManager({});

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
      setDocument: () => {},
      linkService: {
        setDocument: () => {},
        navigateTo: () => {}
      },
      findController: {
        executeCommand: () => {}
      }
    };

    mockStore = {
      dispatch: () => {}
    };

    wrapper = new PdfJsWrapper(
      mockViewer,
      downloadManager,
      new ToolbarEventService(),
      new Subject<string>(),
      new Subject<DocumentLoadProgress>(),
      new Subject<any>(),
      new Subject<Outline>(),
      new Subject(),
      new Subject<PageEvent[]>(),
      new Subject<{ location: PdfPosition }>()
    );
  });

  it('downloads a file', () => {
    const downloadSpy = spyOn(downloadManager, 'downloadUrl');

    wrapper.downloadFile('http://derp.com/derp.jpg', 'derp.jpg');
    expect(downloadSpy).toHaveBeenCalledWith('http://derp.com/derp.jpg', 'derp.jpg');
  });

  it('loads a document', fakeAsync(() => {
    const pdfViewerSpy = spyOn(mockViewer, 'setDocument');
    const newDocumentLoadInitSpy = spyOn(wrapper.documentLoadInit, 'next').and.callThrough();
    const documentLoadedSpy = spyOn(wrapper.documentLoaded, 'next').and.callThrough();
    const mockDocument = { numPages: 10, getOutline: () => {}, getMetadata: () => ({ info: { Title: 'Title' }})};

    spyOnProperty(pdfjsLib, 'getDocument')
      .and.returnValue(() => ({ promise: Promise.resolve(mockDocument)}));

    wrapper.loadDocument("document-url");
    tick();

    expect(pdfViewerSpy).toHaveBeenCalledWith(mockDocument);
    expect(newDocumentLoadInitSpy).toHaveBeenCalledTimes(1);
    expect(documentLoadedSpy).toHaveBeenCalledTimes(1);
  }));

  it('loads a document with exception', fakeAsync(() => {
    const pdfViewerSpy = spyOn(mockViewer, 'setDocument');
    const newDocumentLoadInitSpy = spyOn(wrapper.documentLoadInit, 'next').and.callThrough();
    const documentLoadedSpy = spyOn(wrapper.documentLoaded, 'next').and.callThrough();
    const documentLoadFailedSpy = spyOn(wrapper.documentLoadFailed, 'next').and.callThrough();
    spyOnProperty(pdfjsLib, 'getDocument').and.returnValue(() => ({ promise: Promise.reject(new Error('x'))}));

    wrapper.loadDocument("document-url");
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
    const navigateSpy = spyOn(mockViewer.linkService, 'navigateTo');
    const destination = [];
    destination[1] = { name: 'XYZ' };
    wrapper.navigateTo(destination);

    expect(destination[4]).toEqual(1);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should populate the destination object if the zoom name does not include XYZ', () => {
    const navigateSpy = spyOn(mockViewer.linkService, 'navigateTo');
    const destination = [];
    destination[1] = { name: 'FitH' };
    wrapper.navigateTo(destination);

    expect(destination[2]).toEqual(null);
    expect(destination[3]).toEqual(null);
    expect(destination[4]).toEqual(1);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should not alter the destination if it is not of type object', () => {
    const navigateSpy = spyOn(mockViewer.linkService, 'navigateTo');
    const destination = 1234;
    wrapper.navigateTo(destination);

    expect(destination).toEqual(1234);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should perform zoom operation', () => {
    mockViewer.currentScaleValue = 1;
    wrapper.setZoom(2);

    expect(mockViewer.currentScaleValue).toEqual(2);
  });

  it('should set scale value to max value', () => {
    mockViewer.currentScaleValue = 1;
    wrapper.setZoom(6);

    expect(mockViewer.currentScaleValue).toEqual(5);
  });

  it('should set scale value to min value', () => {
    mockViewer.currentScaleValue = 1;
    wrapper.setZoom(0.001);

    expect(mockViewer.currentScaleValue).toEqual(0.1);
  });

  it('should set scale value to this.zoomValue', () => {
    mockViewer.currentScaleValue = 1;
    wrapper.setZoom(NaN);

    expect(mockViewer.currentScaleValue).toEqual(1);
  });

  it('should step the zoom', () => {
    mockViewer.currentScaleValue = 1;
    wrapper.stepZoom(0.5);

    expect(mockViewer.currentScaleValue).toEqual(1.5);
  });

  it('should call the search operation', () => {
    spyOn(mockViewer.findController, 'executeCommand');

    const searchOperation = {
      searchTerm: 'searchTerm',
      highlightAll: false,
      matchCase: false,
      wholeWord: false,
      previous: false,
      reset: false
    };
    wrapper.search(searchOperation);

    expect(mockViewer.findController.executeCommand).toHaveBeenCalledWith('findagain', {
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
});
