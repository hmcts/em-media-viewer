import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import {select, Store} from '@ngrx/store';
import * as fromStore from '../../../../store/reducers';
import * as fromSelectors from '../../../../store/selectors/tags.selectors';
import * as fromActions from '../../../../store/actions/tags.actions';
import {Observable, Subscription} from 'rxjs';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {auditTime, tap} from 'rxjs/operators';


@Component({
  selector: 'mv-comment-filter',
  templateUrl: './comment-filter.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommentFilterComponent implements OnInit, OnDestroy {
  tagGroup: FormGroup;
  $subscriptions: Subscription;
  filter$: Observable<string[]>;
  allTags$: Observable<any>;
  searchValue: string;
  isPreview = false;
  constructor(
    private store: Store<fromStore.State>,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.tagGroup = this.fb.group({
      'tagFilters': this.fb.group({}),
    });
    this.filter$ = this.store.pipe(select(fromSelectors.getTagFilters));
    this.$subscriptions = this.tagGroup.valueChanges.pipe(auditTime(5)).subscribe(value => {
      const tagFilters = value['tagFilters'];
      this.store.dispatch(new fromActions.AddFilterTags(tagFilters));
    });
    this.buildFrom();

  }

  buildFrom() {
    const checkboxes = <FormGroup>this.tagGroup.get('tagFilters');
    this.allTags$ = this.store.pipe(select(fromSelectors.getAllTagsArr)).pipe(tap(tags => {
      this.tagGroup.reset();
      tags.forEach((value) => {
        checkboxes.addControl(value.key, new FormControl(false));
      });
    }));
  }

  onClearFilters() {
    this.tagGroup.reset();
    this.store.dispatch(new fromActions.ClearFilterTags());
  }

  ngOnDestroy(): void {
    this.$subscriptions.unsubscribe();
  }

  onRemoveFilter(tagName) {
    const checkboxes = <FormGroup>this.tagGroup.get('tagFilters');
    checkboxes.controls[tagName].setValue(false);
  }

  onToggleFilterView() {
    this.isPreview = !this.isPreview
  }


}
