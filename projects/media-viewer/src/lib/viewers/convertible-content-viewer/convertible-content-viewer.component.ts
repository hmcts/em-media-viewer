import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ResponseType, ViewerException } from '../viewer-exception.model';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store/reducers/document.reducer';
import * as fromDocumentActions from '../../store/actions/document.action';
import { Subscription } from 'rxjs';
import * as fromSelectors from '../../store/selectors/document.selectors';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'mv-conversion-viewer',
  templateUrl: './convertible-content-viewer.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ConvertibleContentViewerComponent implements OnInit, OnDestroy {

  @Input() originalUrl;
  @Input() downloadFileName: string;

  @Input() height;

  @Input() enableAnnotations: boolean;
  @Input() enableRedactions: boolean;
  @Input() annotationSet: AnnotationSet | null;


  @Output() mediaLoadStatus = new EventEmitter<ResponseType>();
  @Output() viewerException = new EventEmitter<ViewerException>();
  @Output() documentTitle = new EventEmitter<string>();

  private $subscription: Subscription;
  convertedUrl: string;

  constructor(private store: Store<fromStore.DocumentState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(new fromDocumentActions.Convert(this.extractDMStoreDocId(this.originalUrl)));
    this.$subscription = this.store.pipe(select(fromSelectors.getConvertedDocument), filter(value => !!value))
      .subscribe((docInfo)  => {
      if (docInfo.url) {
        this.convertedUrl = docInfo.url
        this.store.dispatch(new fromDocumentActions.ClearConvertDocUrl());
      } else {
        this.onLoadException(new ViewerException(docInfo.error))
      }
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  onMediaLoad(status: ResponseType) {
    this.mediaLoadStatus.emit(status);
  }

  onLoadException(exception: ViewerException) {
    this.viewerException.emit(exception);
  }

  onDocumentTitleChange(title: string) {
    this.documentTitle.emit(title);
  }

  // todo move this to common place for media viewer and pdf
  private extractDMStoreDocId(url: string): string {
    url = url.includes('/documents/') ? url.split('/documents/')[1] : url;
    return url.replace('/binary', '');
  }
}
