import { Store } from '@ngrx/store';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement, inject } from '@angular/core';

import { RedactionSearchBarComponent } from './redaction-search-bar.component';
import { provideMockStore } from '@ngrx/store/testing';
import { HighlightCreateService } from '../../annotations/annotation-set/annotation-create/highlight-create/highlight-create.service';
import { SearchResultsCount, ToolbarEventService } from '../toolbar-event.service';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { Subject } from 'rxjs';
import { RedactionSearch } from './redaction-search.model';

describe('RedactionSearchBarComponent', () => {
  let component: RedactionSearchBarComponent;
  let fixture: ComponentFixture<RedactionSearchBarComponent>;
  const redactionSerachSubject: Subject<RedactionSearch> = new Subject<RedactionSearch>();
  const searchResultsCountSubject: Subject<SearchResultsCount> = new Subject<SearchResultsCount>();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RedactionSearchBarComponent],
      providers: [
        provideMockStore({}),
        HighlightCreateService,
        {
          provider: ToolbarEventService, useValue: {
            redactionSerachSubject: redactionSerachSubject.asObservable(),
            searchResultsCountSubject: searchResultsCountSubject.asObservable()
          }
        },
        ToolbarButtonVisibilityService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedactionSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should search with reset set to true', () => {
    spyOn(component.toolbarEvents, 'search');
    component.search(true);
    expect(component.toolbarEvents.search).toHaveBeenCalledTimes(1);
    expect(component.redactAll).toBeFalse();
  });

  it('should search with reset set false', () => {
    spyOn(component.toolbarEvents, 'search');
    component.search(false);
    expect(component.toolbarEvents.search).toHaveBeenCalledTimes(1);
    expect(component.redactAll).toBeTrue();
    expect(component.redactElements).toEqual([]);
  });
});
