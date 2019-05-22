import { PdfJsWrapper } from './pdf-js-wrapper';
import { SearchResultsCount, SetCurrentPageOperation } from '../../../model/viewer-operations';
import { Subject } from 'rxjs';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import * as pdfjsLib from 'pdfjs-dist';

describe('PdfJsWrapper', () => {

  it('set up eventbus listeners', () => {
    const eventBus = { on: () => {} };
    const eventBusSpy = spyOn(eventBus, 'on');
    const pdfViewer = { eventBus } as any;
    const wrapper = new PdfJsWrapper(
      new Subject<SearchResultsCount>(),
      new Subject<SetCurrentPageOperation>(),
      pdfViewer,
      new pdfjsViewer.DownloadManager({})
    );

    expect(eventBusSpy).toHaveBeenCalledTimes(4);
  });

  it('downloads a file', () => {
    const eventBus = { on: () => {} };
    const downloadManager = new pdfjsViewer.DownloadManager({});
    const downloadSpy = spyOn(downloadManager, 'downloadUrl');
    const pdfViewer = { eventBus } as any;
    const wrapper = new PdfJsWrapper(
      new Subject<SearchResultsCount>(),
      new Subject<SetCurrentPageOperation>(),
      pdfViewer,
      downloadManager
    );

    wrapper.downloadFile('http://derp.com/derp.jpg', 'derp.jpg');

    expect(downloadSpy).toHaveBeenCalledWith('http://derp.com/derp.jpg', 'derp.jpg');
  });

  it('loads a document', async () => {
    const eventBus = { on: () => {} };
    const setDocument = () => {};
    const linkService = { setDocument };
    const pdfViewer = { eventBus, linkService, setDocument } as any;
    const pdfViewerSpy = spyOn(pdfViewer, 'setDocument');
    const mockDocument = {};

    // hack out the pdf.js function
    pdfjsLib.getDocument = () => Promise.resolve(mockDocument);

    const wrapper = new PdfJsWrapper(
      new Subject<SearchResultsCount>(),
      new Subject<SetCurrentPageOperation>(),
      pdfViewer,
      new pdfjsViewer.DownloadManager({})
    );

    await wrapper.loadDocument({} as any);

    expect(pdfViewerSpy).toHaveBeenCalledWith(mockDocument);
  });

});
