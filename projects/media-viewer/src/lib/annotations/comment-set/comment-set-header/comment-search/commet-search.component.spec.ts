import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ToolbarEventService } from '../../../../toolbar/toolbar.module';
import { CommentSearchComponent } from './comment-search.component';
import { FormsModule } from '@angular/forms';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import {reducers} from '../../../../store/reducers/reducers';
import * as fromActions from '../../../../store/actions/annotations.action';
import { CommentsNavigateComponent } from "../../comment-navigate/comments-navigate.component";

describe('CommentSearch', () => {
  let hostComponent: TestHostComponent;
  let component: CommentSearchComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      declarations: [CommentSearchComponent, TestHostComponent],
      providers: [ToolbarEventService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component = hostComponent.commentSearchComponent;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should focus element', () => {
    spyOn(component.searchInput.nativeElement, 'focus');
    component.ngAfterViewInit();

    expect(component.searchInput.nativeElement.focus).toHaveBeenCalled();
  });

  it('should dispatch search action when search matches',
    inject([Store],(store) => {
      hostComponent.annotations =  [{ comments: [{ content: 'searchText' }] }];
      fixture.detectChanges();
      spyOn(store, 'dispatch');

      component.searchComments('searchText');

      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.SearchComment('searchText'));
  }));

  it('should not dispatch search action when no results found',
    inject([Store],(store) => {
      hostComponent.annotations = [] ;
      fixture.detectChanges();
      spyOn(store, 'dispatch');

      component.searchComments('searchText');

      expect(store.dispatch).not.toHaveBeenCalledWith(new fromActions.SearchComment('searchText'));
  }));

  it('should clear search',
    inject([Store],(store) => {
      spyOn(store, 'dispatch');

      component.clearSearch();

      expect(component.searchString).toBeUndefined();
      expect(component.searchResults).toEqual([]);
      expect(component.searchIndex).toBe(0);
  }));
});

@Component({
  selector: `host-component`,
  template: `
    <mv-comment-search [annotations]="annotations"></mv-comment-search>`
})
class TestHostComponent {
  annotations = [] ;

  @ViewChild(CommentSearchComponent) commentSearchComponent: CommentSearchComponent;
}

