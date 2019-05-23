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
});
