import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  printDocumentNatively(url) {
    const printWindow = window.open(url);
    printWindow.print();
  }
}
