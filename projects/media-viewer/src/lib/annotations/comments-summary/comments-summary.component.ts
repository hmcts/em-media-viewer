import { Component, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { PrintService } from '../../print.service';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { AnnotationSet } from '../annotation-set/annotation-set.model';
import { CommentsSummary } from './comments-summary.model';
import {ViewerEventService} from '../../viewers/viewer-event.service';

@Component({
  selector: 'mv-comments-summary',
  templateUrl: './comments-summary.component.html',
})
export class CommentsSummaryComponent implements OnChanges {

  @Input() title: string;
  @Input() contentType: string;
  @Input() annotationSet: AnnotationSet | null;

  comments: CommentsSummary[] = [];

  @ViewChild('commentContainer') commentsTable: ElementRef;

  constructor(
    private readonly printService: PrintService,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService
  ) {}

  ngOnChanges() {
    if (this.annotationSet) {
      this.generateCommentsSummary();
      this.orderCommentsSummary();
    }
  }

  generateCommentsSummary() {
    this.annotationSet.annotations
      .forEach(annotation => {
        if (annotation.comments.length) {
          this.comments.push({
            page: annotation.page,
            comment: annotation.comments[0],
            x: annotation.rectangles[0].x,
            y: annotation.rectangles[0].y
          });
        }
      });
  }

  orderCommentsSummary() {
    this.comments
      .sort((a, b) => a.x >= b.x ? 1 : -1)
      .sort((a, b) => a.y >= b.y ? 1 : -1)
      .sort((a, b) => a.page - b.page);
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
