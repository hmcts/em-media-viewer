import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { PrintService } from '../print.service';
import { Observable } from 'rxjs/index';
import { ToolbarEventService } from '../toolbar/toolbar-event.service';
import { Annotation } from '../annotations/annotation-set/annotation/annotation.model';

@Component({
  selector: 'mv-comments-summary',
  templateUrl: './comments-summary.component.html',
  styleUrls: ['./comments-summary.component.scss']
})
export class CommentsSummaryComponent {

  @Input() title: string;
  comments: Observable<Annotation[]>;

  @ViewChild('commentContainer') commentsTable: ElementRef;

  constructor(
    private readonly printService: PrintService,
    private readonly toolbarEvents: ToolbarEventService
  ) {}

  public onClose(): void {
    this.toolbarEvents.displayCommentSummary();
  }

  public onPrint(): void {
    this.printService.printElementNatively(this.commentsTable.nativeElement, 1000, 900);
  }

  navigateToPage(pageNumber: number) {
    this.toolbarEvents.setPage(pageNumber);
    this.toolbarEvents.displayCommentSummary();
  }
}
