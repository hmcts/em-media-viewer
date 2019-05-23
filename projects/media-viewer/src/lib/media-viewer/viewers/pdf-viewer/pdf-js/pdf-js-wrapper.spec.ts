import { PdfJsWrapper } from './pdf-js-wrapper';
import { SearchResultsCount, SetCurrentPageOperation } from '../../../model/viewer-operations';
import { Subject } from 'rxjs';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import * as pdfjsLib from 'pdfjs-dist';

describe('PdfJsWrapper', () => {

  let eventBus: any;
  let eventBusSpy: any;
  let downloadManager: any;
  let pdfViewer: any;
  let wrapper: PdfJsWrapper;

  beforeEach(() => {
    eventBus = { on: () => {} };
    eventBusSpy = spyOn(eventBus, 'on');
    downloadManager = new pdfjsViewer.DownloadManager({});
    pdfViewer = { eventBus } as any;
    wrapper = new PdfJsWrapper(
      new Subject<SearchResultsCount>(),
      new Subject<SetCurrentPageOperation>(),
      pdfViewer,
      downloadManager
    );
  });

  it('set up eventbus listeners', () => {
    expect(eventBusSpy).toHaveBeenCalledTimes(4);
  });

  it('downloads a file', () => {
    const downloadSpy = spyOn(downloadManager, 'downloadUrl');

    wrapper.downloadFile('http://derp.com/derp.jpg', 'derp.jpg');
    expect(downloadSpy).toHaveBeenCalledWith('http://derp.com/derp.jpg', 'derp.jpg');
  });

  it('loads a document', async () => {
     eventBus = { on: () => {} };
    const setDocument = () => {};
    const linkService = { setDocument };
    pdfViewer = { eventBus, linkService, setDocument } as any;
    const pdfViewerSpy = spyOn(pdfViewer, 'setDocument');
    const mockDocument = {};

    // hack out the pdf.js function
    pdfjsLib.getDocument = () => Promise.resolve(mockDocument);

    wrapper = new PdfJsWrapper(
      new Subject<SearchResultsCount>(),
      new Subject<SetCurrentPageOperation>(),
      pdfViewer,
      new pdfjsViewer.DownloadManager({})
    );

    await wrapper.loadDocument({} as any);

    expect(pdfViewerSpy).toHaveBeenCalledWith(mockDocument);
  });

  // it('should set scale value to max value', () => {
  //   spyOn(mockWrapper, 'search');
  //   component.zoomOperation = new ZoomOperation(6);
  //   expect(mockViewer.currentScaleValue).toEqual(5);
  // });

  // it('should set scale value to min value', () => {
  //   component.zoomOperation = new ZoomOperation(0.001);
  //   expect(mockViewer.currentScaleValue).toEqual(0.1);
  // });

  // TODO In wrapper
  // it('should step the zoom', () => {
  //   component.zoomOperation = new ZoomOperation(2);
  //   component.stepZoomOperation = new StepZoomOperation(0.5);
  //   expect(mockViewer.currentScaleValue).toEqual(2.5);
  // });

  // TODO In wrapper
  // it('should search the pdf', () => {
  //   component.searchOperation = new SearchOperation(2);
  //   component.searchOperation = new SearchOperation(0.5);
  //   expect(mockViewer.searchBoi).toEqual(2.5);
  // });

  // TODO In wrapper
  // it('should print the pdf', () => {
  //   component.printOperation = new PrintOperation(2);
  //   component.PrintOperation = new PrintOperation(0.5);
  //   expect(mockViewer.PrintBoi).toEqual(2.5);
  // });

  // // TODO In wrapper
  // it('should download the pdf', () => {
  //   mockViewer.pdf = 1;
  //   component.pdf = new pdf(2);
  //   expect(mockViewer.currentPageNumber).toEqual(2);
  // });

  // TODO In wrapper
  // it('should set the current page', () => {
  //   mockViewer.currentPageNumber = 1;
  //   component.setCurrentPage = new SetCurrentPageOperation(2);
  //   expect(mockViewer.currentPageNumber).toEqual(2);
  // });

  // // TODO In wrapper
  // it('should change the current page', () => {
  //   mockViewer.currentPageNumber = 1;
  //   component.changePageByDelta = new ChangePageByDeltaOperation(-2);
  //   expect(mockViewer.currentPageNumber).toEqual(-1);
  // });
});
