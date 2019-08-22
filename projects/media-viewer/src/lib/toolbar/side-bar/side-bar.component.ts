import * as pdfjsLib from 'pdfjs-dist';
import {AfterContentInit, Component, ElementRef, ViewChild} from '@angular/core';
import {PdfJsWrapperFactory} from "../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper.provider";

@Component({
  selector: 'mv-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class SideBarComponent implements AfterContentInit {

  @ViewChild('outlineContainer') outlineContainer: ElementRef;

  constructor(
    private readonly pdfJsWrapperFactory: PdfJsWrapperFactory) {
  }

  async ngAfterContentInit() {
    const x = this.pdfJsWrapperFactory.createDocumentOutline(this.outlineContainer);
    const loadingTask = pdfjsLib.getDocument({
      url: 'assets/example3.pdf',
      cMapUrl: 'assets/minified/cmaps',
      cMapPacked: true,
      withCredentials: true
    });

    loadingTask.then(pdf => {
      console.log(pdf);
      pdf.getOutline().then((outline) => {
        x.render({ outline, });
      });
    });
  }
}
