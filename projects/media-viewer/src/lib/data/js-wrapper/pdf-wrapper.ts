declare const pdfjsLib: any;
declare const PDFViewerApplication: any;
// import webViewerLoad from 'dist/media-viewer/assets/minified/web/pdf.viewer.js';

// import webViewerLoad from 'dist/media-viewer/assets/generic/web/viewer.js';

export class PdfWrapper {

    getDocument(documentId): any {
        return pdfjsLib.getDocument(documentId);
    }

    getPage(pageIndex: number) {
      return pdfjsLib.getPage(pageIndex);
    }

    initViewer() {
    }

}
