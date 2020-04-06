import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import {select, Store} from '@ngrx/store';
import * as fromStore from '../../../../store/reducers';
import * as fromSelectors from '../../../../store/selectors/tags.selectors';
import * as fromActions from '../../../../store/actions/tags.actions';
import {Observable, Subscription} from 'rxjs';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';


@Component({
  selector: 'mv-comment-filter',
  templateUrl: './comment-filter.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommentFilterComponent implements OnInit, OnDestroy{
  tagGroup: FormGroup;
  $subscriptions: Subscription;
  filter$: Observable<string[]>;
  searchValue: string;
  constructor(
    private store: Store<fromStore.State>,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.bulldFrom();
    this.filter$ = this.store.pipe(select(fromSelectors.getTagFilters));

  }

  bulldFrom() {
    this.tagGroup = this.fb.group({
      'tagFilters': this.fb.group({}),
    });
    const checkboxes = <FormGroup>this.tagGroup.get('tagFilters');
    this.$subscriptions = this.store.pipe(select(fromSelectors.getAllTagsArr)).subscribe(tags => {
      tags.forEach(value => checkboxes.addControl(value, new FormControl(false)));
    });
    const formValues = this.tagGroup.valueChanges.subscribe(value => {
      const tagFilters = value['tagFilters'];
      this.store.dispatch(new fromActions.AddFilterTags(tagFilters));
    });
    this.$subscriptions.add(formValues);
  }

  ngOnDestroy(): void {
    this.$subscriptions.unsubscribe();
  }


}
