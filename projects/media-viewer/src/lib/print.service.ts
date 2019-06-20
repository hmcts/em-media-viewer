import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  printDocumentNatively(url: string): void {
    const printWindow = window.open(url);
    printWindow.print();
  }

  printElementNatively(element: HTMLElement, width: number, height: number): void {
    const printWindow = window.open('', '', `left=0,top=0,width=${width},height=${height},toolbar=0,scrollbars=0,status=0`);

    printWindow.document.write(element.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
}
