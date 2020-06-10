import {Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, OnInit} from '@angular/core';
import { PrintService } from '../../print.service';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { AnnotationSet } from '../annotation-set/annotation-set.model';
import { CommentsSummary } from './comments-summary.model';
import {ViewerEventService} from '../../viewers/viewer-event.service';
import {debug} from 'ng-packagr/lib/util/log';
import {select, Store} from '@ngrx/store';
import * as fromSelectors from '../../store/selectors/annotations.selectors';
import * as fromStore from '../../store/reducers/reducers';
import {Observable} from 'rxjs';
import {Annotation} from '../annotation-set/annotation-view/annotation.model';
import {tap} from 'rxjs/operators';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'mv-comments-summary',
  templateUrl: './comments-summary.component.html',
})
export class CommentsSummaryComponent implements OnInit {

  @Input() title: string;
  @Input() contentType: string;
  @ViewChild('commentContainer') commentsTable: ElementRef;
  public comments$: Observable<{comment: string; tags: object[]; date: string; user: string; page: string}>
  public dateRangeFg: FormGroup;

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private readonly printService: PrintService,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dateRangeFg = this.fb.group({
      dateRangeFrom: new FormGroup({
        day: new FormControl(''),
        month: new FormControl(''),
        year: new FormControl('')
      }),
      dateRangeTo: new FormGroup({
        day: new FormControl(''),
        month: new FormControl(''),
        year: new FormControl('')
      })
    });
    this.comments$ = this.store.pipe(select(fromSelectors.getCommentSummary), tap(console.log));
  }

  public onClose(): void {
    this.toolbarEvents.toggleCommentsSummary(false);
  }

  public onPrint(): void {
    this.printService.printElementNatively(this.commentsTable.nativeElement, 1000, 900);
  }

  navigateToPage(pageNumber: number) {
    if (this.contentType === 'pdf') {
      this.toolbarEvents.setPage(pageNumber);
    }
    this.toolbarEvents.toggleCommentsSummary(false);
    this.viewerEvents.toggleCommentsPanel(true);
  }
}
