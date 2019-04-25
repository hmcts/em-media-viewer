import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  ChangeDetectorRef,
  Renderer2,
  OnDestroy,
  ComponentRef, AfterViewInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import {PdfService} from '../../../data/pdf.service';
import { Utils } from '../../../data/utils';
import { PdfAnnotateWrapper } from '../../../data/js-wrapper/pdf-annotate-wrapper';
import { CommentsComponent } from '../../annotation/comments/comments.component';
import { ContextualToolbarComponent } from './contextual-toolbar/contextual-toolbar.component';
import { RenderOptions } from '../../../data/js-wrapper/renderOptions.model';
import { PdfRenderService } from '../../../data/pdf-render.service';
import { RotationFactoryService } from './rotation-toolbar/rotation-factory.service';
import { RotationComponent } from './rotation-toolbar/rotation.component';
import { RotationModel } from '../../../model/rotation-factory.model';
import {MediaViewerFeatures} from '../../media-viewer-features';
import {PdfWrapper} from '../../../data/js-wrapper/pdf-wrapper';


@Component({
    selector: 'app-pdf-viewer',
    templateUrl: './pdf-viewer.component.html',
    styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements AfterViewInit {

  constructor(private pdfWrapper: PdfWrapper) {
  }

  ngAfterViewInit(): void {
      this.pdfWrapper.initViewer(this.url);
  }

  @Input() url: string;
  @Input() mediaViewerFeatures = new MediaViewerFeatures();

}
