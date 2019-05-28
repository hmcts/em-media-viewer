import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import { ElementRef } from '@angular/core';
import { PdfJsWrapper } from './pdf-js-wrapper';
import { SearchResultsCount, SetCurrentPageOperation } from '../../../model/viewer-operations';
import { Subject } from 'rxjs';

export class PdfJsWrapperFactory {

  public create(container: ElementRef): PdfJsWrapper {
    const pdfLinkService = new pdfjsViewer.PDFLinkService();
    const eventBus = new pdfjsViewer.EventBus();
    const pdfFindController = new pdfjsViewer.PDFFindController({
      linkService: pdfLinkService,
      eventBus: eventBus
    });

    const pdfViewer = new pdfjsViewer.PDFViewer({
      container: container.nativeElement,
      linkService: pdfLinkService,
      findController: pdfFindController,
      eventBus: eventBus
    });

    pdfLinkService.setViewer(pdfViewer);

    return new PdfJsWrapper(
      new Subject<SearchResultsCount>(),
      new Subject<SetCurrentPageOperation>(),
      pdfViewer,
      new pdfjsViewer.DownloadManager({})
    );
  }

}
