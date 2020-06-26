import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import { ElementRef, Injectable } from '@angular/core';
import {DocumentLoadProgress, PageEvent, PdfJsWrapper} from './pdf-js-wrapper';
import { Subject } from 'rxjs';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { Outline } from '../side-bar/outline-item/outline.model';
import { PdfPosition } from '../../../store/reducers/document.reducer';

@Injectable({providedIn: 'root'})
export class PdfJsWrapperFactory {

  private linkService: pdfjsViewer.PDFLinkService;
  private eventBus: pdfjsViewer.EventBus;
  private pdfJsWrapper: PdfJsWrapper;

  constructor(private readonly toolbarEvents: ToolbarEventService) {
    this.linkService = new pdfjsViewer.PDFLinkService();
    this.eventBus = new pdfjsViewer.EventBus();
  }

  public create(container: ElementRef): PdfJsWrapper {
    const pdfFindController = new pdfjsViewer.PDFFindController({
      linkService: this.linkService,
      eventBus: this.eventBus
    });

    const pdfViewer = new pdfjsViewer.PDFViewer({
      container: container.nativeElement,
      linkService: this.linkService,
      findController: pdfFindController,
      eventBus: this.eventBus,
      imageResourcesPath: '/assets/images/',
      textLayerMode: 2
    });

    this.linkService.setViewer(pdfViewer);

    this.pdfJsWrapper = new PdfJsWrapper(
      pdfViewer,
      new pdfjsViewer.DownloadManager({}),
      this.toolbarEvents,
      new Subject<string>(),
      new Subject<DocumentLoadProgress>(),
      new Subject<any>(),
      new Subject<Outline>(),
      new Subject(),
      new Subject<PageEvent[]>(),
      new Subject<{ location: PdfPosition }>()
    );

    return this.pdfJsWrapper;
  }

  pdfWrapper() {
    return this.pdfJsWrapper;
  }
}
