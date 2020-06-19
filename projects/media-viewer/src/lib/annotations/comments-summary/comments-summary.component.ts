import {Component, Input, ViewChild, ElementRef, OnInit} from '@angular/core';
import { PrintService } from '../../print.service';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import {select, Store} from '@ngrx/store';
import * as fromSelectors from '../../store/selectors/annotations.selectors';
import * as fromStore from '../../store/reducers/reducers';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'mv-comments-summary',
  templateUrl: './comments-summary.component.html',
})
export class CommentsSummaryComponent implements OnInit {

  @Input() title: string;
  @Input() contentType: string;
  public comments$: Observable<{comment: string; tags: object[]; date: string; user: string; page: string}>
  @ViewChild('commentContainer') commentsTable: ElementRef;

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private readonly printService: PrintService,
    private readonly toolbarEvents: ToolbarEventService
  ) {}

  ngOnInit(): void {
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
    this.toolbarEvents.toggleCommentsPanel(true);
  }
}
