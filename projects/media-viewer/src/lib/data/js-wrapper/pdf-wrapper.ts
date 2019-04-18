declare const pdfjsLib: any;

export class PdfWrapper {

    getDocument(documentId): any {
        return pdfjsLib.getDocument(documentId);
    }
}
