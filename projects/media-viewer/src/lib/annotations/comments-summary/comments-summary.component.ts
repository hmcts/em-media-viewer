import {Component, Input, ViewChild, ElementRef, OnInit, OnDestroy} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { combineLatest, Observable, Subscription } from 'rxjs';
import {select, Store} from '@ngrx/store';

import { PrintService } from '../../print.service';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import * as fromSelectors from '../../store/selectors/annotation.selectors';
import * as fromStore from '../../store/reducers/reducers';
import * as fromAnnoActions from '../../store/actions/annotation.actions';
import * as fromTagSelectors from '../../store/selectors/tag.selectors';

@Component({
  selector: 'mv-comments-summary',
  templateUrl: './comments-summary.component.html',
})
export class CommentsSummaryComponent implements OnInit, OnDestroy {

  @Input() title: string;
  @Input() contentType: string;
  @ViewChild('outerContainer') container: ElementRef;
  @ViewChild('commentContainer') commentsTable: ElementRef;
  public comments$: Observable<any>;
  public filtersFg: FormGroup;
  private $subscriptions: Subscription;
  allTags$: Observable<{key: string; length: number}[]>;
  showFilters = false;
  hasFilter = false;

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private readonly printService: PrintService,
    private readonly toolbarEvents: ToolbarEventService,
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
    this.comments$ = this.store.pipe(select(fromSelectors.getCommentSummary));
    this.buildCheckBoxForm();
    this.container.nativeElement.focus();
  }

  buildCheckBoxForm() {
    this.filtersFg.reset();
    const checkboxes = <FormGroup>this.filtersFg.get('tagFilters');
    const filters$ = this.store.pipe(select(fromSelectors.getCommentSummaryFilters));
    this.allTags$ = this.store.pipe(select(fromTagSelectors.getAllTagsArr));
    this.$subscriptions = combineLatest([this.allTags$, filters$]).subscribe(([tags, filters]) => {
      this.hasFilter = filters.hasFilter;
      tags.forEach((val) => {
        const checkBoxValue = (filters.filters.tagFilters &&
          filters.filters.tagFilters.hasOwnProperty(val.key)) ?
          filters.filters.tagFilters[val.key] : false;
        checkboxes.addControl(val.key, new FormControl(checkBoxValue));
      });
      this.filtersFg.updateValueAndValidity();
    });
  }

  onClearFilters() {
    this.store.dispatch(new fromAnnoActions.ClearCommentSummaryFilters());
    this.buildCheckBoxForm();
  }

  onFilter() {
    const { value } = this.filtersFg;
    const hasDateFrom =  (value.dateRangeFrom.year && value.dateRangeFrom.month && value.dateRangeFrom.day);
    const hasDateTo = (value.dateRangeTo.year && value.dateRangeTo.month && value.dateRangeTo.day);
    const dateRangeFrom = hasDateFrom ?
      new Date(value.dateRangeFrom.year, value.dateRangeFrom.month - 1, value.dateRangeFrom.day).getTime() : null;
    const dateRangeTo = hasDateTo ?
      new Date(value.dateRangeTo.year, value.dateRangeTo.month - 1, value.dateRangeTo.day).getTime() : null;
    this.store.dispatch(new fromAnnoActions.ApplyCommentSymmaryFilter({...value, dateRangeFrom, dateRangeTo}));
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
    this.toolbarEvents.toggleCommentsPanel(true);
  }

  ngOnDestroy(): void {
    this.$subscriptions.unsubscribe();
  }
}
