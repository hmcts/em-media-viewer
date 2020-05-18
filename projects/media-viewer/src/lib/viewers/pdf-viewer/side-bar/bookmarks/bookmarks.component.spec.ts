import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { BookmarksComponent } from './bookmarks.component';
import { Store, StoreModule } from '@ngrx/store';
import * as fromActions from 'projects/media-viewer/src/lib/store/actions/bookmarks.action';
import { reducers } from '../../../../store/reducers/reducers';

describe('BookmarksComponent', () => {
  let component: BookmarksComponent;
  let fixture: ComponentFixture<BookmarksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarksComponent ],
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete bookmark',
    inject([Store],(store) => {
      spyOn(store, 'dispatch');
      const mockBookmark = {name: 'Bookmark name', id: 'id'} as any;
      component.deleteBookmark(mockBookmark);
      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.DeleteBookmark('id'));
    })
  );

  it('should update bookmark',
    inject([Store],(store) => {
      spyOn(store, 'dispatch');
      const mockBookmark = {name: 'Bookmark name', id: 'id'} as any;
      const newName = 'Bookmark new name';
      component.updateBookmark(mockBookmark, newName);
      mockBookmark.name = newName;
      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.UpdateBookmark(mockBookmark));
    })
  );
});
