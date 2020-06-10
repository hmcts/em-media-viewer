import {Component, Input, ViewChild, ElementRef, OnInit} from '@angular/core';
import { PrintService } from '../../print.service';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import {ViewerEventService} from '../../viewers/viewer-event.service';
import {select, Store} from '@ngrx/store';
import * as fromSelectors from '../../store/selectors/annotations.selectors';
import * as fromStore from '../../store/reducers/reducers';
import * as fromAnnoActions from  '../../store/actions/annotations.action';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

import * as fromTagSelectors from '../../store/selectors/tags.selectors';

@Component({
  selector: 'mv-comments-summary',
  templateUrl: './comments-summary.component.html',
})
export class CommentsSummaryComponent implements OnInit {

  @Input() title: string;
  @Input() contentType: string;
  @ViewChild('commentContainer') commentsTable: ElementRef;
  public comments$: Observable<any>;
  public filtersFg: FormGroup;
  allTags$: Observable<{key: string; length: number}[]>;
  showFilters = false;

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private readonly printService: PrintService,
    private readonly toolbarEvents: ToolbarEventService,
    private readonly viewerEvents: ViewerEventService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filtersFg = this.fb.group({
      dateRangeFrom: new FormGroup({
        day: new FormControl(''),
        month: new FormControl(''),
        year: new FormControl('')
      }),
      dateRangeTo: new FormGroup({
        day: new FormControl(''),
        month: new FormControl(''),
        year: new FormControl('')
      }),
      tagFilters: this.fb.group({}),
    });
    this.comments$ = this.store.pipe(select(fromSelectors.getCommentSummary), tap(console.log));
    this.buildCheckBoxFrom();
  }

  buildCheckBoxFrom() {
    const checkboxes = <FormGroup>this.filtersFg.get('tagFilters');
    this.allTags$ = this.store.pipe(select(fromTagSelectors.getAllTagsArr)).pipe(tap(tags => {
      this.filtersFg.reset();
      tags.forEach((value) => {
        checkboxes.addControl(value.key, new FormControl(false));
      });
    }));
  }

  onFilter() {
    const {value} = this.filtersFg;
    const dateRangeFrom = new Date(value.dateRangeFrom.year, value.dateRangeFrom.month, value.dateRangeFrom.day);
    const dateRangeTo = new Date(value.dateRangeTo.year, value.dateRangeTo.month, value.dateRangeTo.day);
    this.store.dispatch(new fromAnnoActions.ApplyCommentSymmaryFilter(value))
    debugger
  }

  onFiltersToggle() {
    this.showFilters = !this.showFilters;
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
