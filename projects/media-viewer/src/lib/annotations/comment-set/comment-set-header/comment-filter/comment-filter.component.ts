import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {select, Store} from '@ngrx/store';
import * as fromStore from '../../../../store/reducers';
import * as fromSelectors from '../../../../store/selectors/tags.selectors';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';


@Component({
  selector: 'mv-comment-filter',
  templateUrl: './comment-filter.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommentFilterComponent implements OnInit{
  allTags$: Observable<any>;
  tagGroup: FormGroup;
  constructor(
    private store: Store<fromStore.State>,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.allTags$ = this.store.pipe(select(fromSelectors.getAllTagsArr), tap(console.log));
    this.tagGroup = this.fb.group({
      allTags: new FormControl('')
    })
  }

  onFilterTags() {
    debugger;
  }
}
