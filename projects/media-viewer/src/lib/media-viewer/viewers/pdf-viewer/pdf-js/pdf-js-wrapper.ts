import {ElementRef} from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/web/pdf_viewer.css';
import 'pdfjs-dist/build/pdf.worker';

export class PdfJsWrapper {

    getDocument(documentId): any {
        return pdfjsLib.getDocument(documentId);
    }

    getPage(pageIndex: number) {
      return pdfjsLib.getPage(pageIndex);
    }

    initViewer(documentUrl: string, container: ElementRef): [any, any] {

      if (!pdfjsLib.getDocument || !pdfjsViewer.PDFPageView) {
        alert('pdfjsLib or pdfjsViewer are not unavailable.');
      }

      const CMAP_URL = 'assets/minified/cmaps';
      const CMAP_PACKED = true;

      const DEFAULT_URL = documentUrl;

      // (Optionally) enable hyperlinks within PDF files.
      const pdfLinkService = new pdfjsViewer.PDFLinkService();

      // (Optionally) enable find controller.
      const pdfFindController = new pdfjsViewer.PDFFindController({
        linkService: pdfLinkService,
      });

      const pdfViewer = new pdfjsViewer.PDFViewer({
        container: container.nativeElement,
        linkService: pdfLinkService,
        findController: pdfFindController,
      });
      pdfLinkService.setViewer(pdfViewer);

      document.addEventListener('pagesinit', function () {
        // We can use pdfViewer now, e.g. let's change default scale.
        pdfViewer.currentScaleValue = 'page-width';

        // pdfFindController.executeCommand('find', { query: "run", });
      });

      // Loading document.
      const loadingTask = pdfjsLib.getDocument({
        url: DEFAULT_URL,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
      });
      loadingTask.promise.then(function(pdfDocument) {
        // Document loaded, specifying document for the viewer and
        // the (optional) linkService.
        pdfViewer.setDocument(pdfDocument);

        pdfLinkService.setDocument(pdfDocument, null);
      });

      return [pdfViewer, pdfFindController];

    }

}
