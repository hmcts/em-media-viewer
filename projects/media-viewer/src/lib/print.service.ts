import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  printDocumentNatively(url: string): void {
    const printWindow = window.open(url);
    printWindow.focus();
    setTimeout((printer) => {
      printer.print();
    }, 3000, printWindow);
  }

  printElementNatively(element: HTMLElement, width: number, height: number): void {
    const printWindow = window.open('', '', `left=0,top=0,width=${width},height=${height},toolbar=0,scrollbars=0,status=0`);
    const documentHead = document.head;
    printWindow.document.body.appendChild(documentHead.cloneNode(true));
    printWindow.document.body.appendChild(element.cloneNode(true));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
}
