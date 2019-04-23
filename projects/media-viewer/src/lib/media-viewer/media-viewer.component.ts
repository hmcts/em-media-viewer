import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ViewerAnchorDirective } from './viewer-anchor.directive';
import { MediaViewerService } from './media-viewer.service';
import { ViewerFactoryService } from '../viewers/viewer-factory.service';
import { EmLoggerService } from '../logging/em-logger.service';
import { AnnotationStoreService } from '../data/annotation-store.service';

@Component({
    selector: 'app-media-viewer',
    templateUrl: './media-viewer.component.html'
})
export class MediaViewerComponent {

    // @ViewChild(ViewerAnchorDirective) viewerAnchor: ViewerAnchorDirective;
    @Input() url = '';
    @Input() annotate = false;
    @Input() baseUrl = '';
    @Input() isDM = true;
    @Input() contentType: string;
    @Input() rotate = false;

    private supportedContentTypes = ['pdf', 'image'];

    // viewerComponent: any;
    // error: HttpErrorResponse;

    constructor(private log: EmLoggerService) {
        log.setClass('MediaViewerComponent');
    }

  //   ngOnChanges(changes: SimpleChanges) {
  //       if (changes.url || changes.annotate || changes.contentType) {
  //         this.buildViewer();
  //       }
  //   }
  //
  //   buildViewer() {
  //       if (!this.url) {
  //           this.log.error('url is required argument');
  //           throw new Error('url is required argument');
  //       }
  //       if (this.isDM) {
  //         this.documentViewerService
  //           .getDocumentMetadata(this.formatUrl(this.url))
  //           .subscribe(metadata => {
  //             this.log.info(metadata);
  //             if (metadata && metadata._links) {
  //               const url = this.formatUrl(metadata._links.binary.href);
  //               const dmDocumentId = this.viewerFactoryService.getDocumentId(metadata);
  //               if (this.annotate) {
  //                 this.annotationStoreService.getAnnotationSet(this.baseUrl, dmDocumentId).subscribe(annotationSet => {
  //                   this.buildComponent(metadata, url, annotationSet.body);
  //                 });
  //               } else {
  //                 this.buildComponent(metadata, url, null);
  //               }
  //             }
  //         }, err => {
  //           this.log.error('An error has occured while fetching document' + err);
  //           this.error = err;
  //         });
  //       } else {
  //         this.viewerComponent = this.viewerFactoryService.buildComponent(this.viewerAnchor.viewContainerRef,
  //           this.contentType, this.url, this.baseUrl, this.url, this.annotate, null, this.rotate);
  //       }
  //   }
  //
  //   buildComponent(metadata, url, annotationSet?) {
  //     this.viewerFactoryService.buildComponent(this.viewerAnchor.viewContainerRef,
  //       metadata.mimeType, url, this.baseUrl, metadata._links.self.href, this.annotate, annotationSet, this.rotate);
  //   }
  //
  //
  //
  // formatUrl(url: string): string {
  //   return url.replace(/http.*\/documents\//, `${this.baseUrl}/documents/`);
  // }
  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }
}
