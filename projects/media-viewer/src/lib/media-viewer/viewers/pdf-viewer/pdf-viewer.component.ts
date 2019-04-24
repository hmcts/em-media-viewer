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
      this.pdfWrapper.initViewer();
  }

    @Input() url: string;
    @Input() mediaViewerFeatures = new MediaViewerFeatures();
    //
    // private page: number;
    // private focusedAnnotationSubscription: Subscription;
    // private pageNumberSubscription: Subscription;
    // private pdfPageSubscription: Subscription;
    // rotationComponents: ComponentRef<RotationComponent>[] = [];
    //
    // // @ViewChild("viewerCanvas") tref: ElementRef;
    // @ViewChild('pageContainer') pageContainer: ElementRef;
    // // @ViewChild('viewer') viewerElementRef: ElementRef;
    // // @ViewChild('annotationWrapper') annotationWrapper: ElementRef;
    // // @ViewChild('commentsComponent') commentsComponent: CommentsComponent;
    // // @ViewChild('contextualToolbar') contextualToolbar: ContextualToolbarComponent;
    //
    // constructor(private pdfService: PdfService,
    //             private utils: Utils,
    //             private ref: ChangeDetectorRef,
    //             private renderer: Renderer2,
    //             private pdfAnnotateWrapper: PdfAnnotateWrapper,
    //             private pdfRenderService: PdfRenderService,
    //             private rotationFactoryService: RotationFactoryService) {
    // }
    //
    // ngOnInit() {
    //     // this.loadAnnotations(this.annotate);
    //     // this.pdfService.preRun();
    //     // this.pdfRenderService.setRenderOptions(new RenderOptions(
    //     //     this.url,
    //     //     null,
    //     //     parseFloat('1.33'),
    //     //     0,
    //     //     []
    //     // ));
    //
    //     // if (this.mediaViewerFeatures.enableRotation) {
    //     //     this.pdfPageSubscription = this.pdfRenderService.listPagesSubject
    //     //       .subscribe((listPages: RotationModel[]) => {
    //     //         this.rotationComponents.forEach(rc => rc.destroy());
    //     //         listPages.forEach(pageDetails => {
    //     //           this.rotationComponents.push(this.rotationFactoryService.addToDom(pageDetails));
    //     //         });
    //     //       });
    //     // }
    //     this.pdfRenderService.render({url: this.url, pageContainer: this.pageContainer});
    //     // this.pdfService.setAnnotationWrapper(this.annotationWrapper);
    //
    //     // this.pageNumberSubscription = this.pdfService.getPageNumber()
    //     //     .subscribe(page => this.page = page);
    // }
    //
    // ngOnDestroy() {
    //     if (this.pageNumberSubscription) {
    //         this.pageNumberSubscription.unsubscribe();
    //     }
    //     if (this.focusedAnnotationSubscription) {
    //         this.focusedAnnotationSubscription.unsubscribe();
    //     }
    //     if (this.pdfPageSubscription) {
    //         this.pdfPageSubscription.unsubscribe();
    //     }
    // }

}
