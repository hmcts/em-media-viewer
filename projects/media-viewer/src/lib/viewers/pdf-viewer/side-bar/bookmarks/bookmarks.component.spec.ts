import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { BookmarksComponent } from './bookmarks.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import * as fromActions from '../../../../store/actions/bookmarks.action';
import { reducers } from '../../../../store/reducers/reducers';

describe('BookmarksComponent', () => {
  let component: BookmarksComponent;
  let fixture: ComponentFixture<BookmarksComponent>;

  const bookmarks = [
    { id: 1, name: 'root1', next: 4 },
    { id: 2, name: 'child1', parent: 1, next: 3 },
    { id: 3, name: 'child2', parent: 1, previous: 2 },
    { id: 5, name: 'child2.1', parent: 4, next: 6 },
    { id: 7, name: 'subsub', parent: 6 },
    { id: 4, name: 'root2', previous: 1 },
    { id: 6, name: 'child2.2', parent: 4, previous: 5 }
  ] as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarksComponent ],
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
    inject([Store], (store) => {
      spyOn(store, 'dispatch');
      const bookmarkNode = {
        parent: { children: [{}]},
        index: 0,
        data: { id: 'bookmarkId', children: [] }
      } as any;
      component.deleteBookmark(bookmarkNode);
      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.DeleteBookmark({
        deleted: ['bookmarkId'], updated: undefined
      }));
    })
  );

  it('should update bookmark',
    inject([Store], (store) => {
      spyOn(store, 'dispatch');
      const mockBookmark = {name: 'Bookmark name', id: 'id'} as any;
      const newName = 'Bookmark new name';
      component.updateBookmark(mockBookmark, newName);
      mockBookmark.name = newName;
      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.UpdateBookmark(mockBookmark));
    })
  );

  it('should move bookmarks',
    inject([Store], (store) => {
      spyOn(store, 'dispatch');
      const node = {
        documentId: '86dc297a-0153-44c0-b996-f563c1ff112a',
        id: 'id1',
        index: 0,
        name: 'new bookmark',
        parent: undefined,
        previous: undefined
    };
      const from = { index: 0, parent: { children: [{ id: 'id2', index: 1 }, { id: 'id1', index: 0 }] } };
      const to = { index: 1, parent: { children: [{ id: 'id2', index: 1 }, { id: 'id1', index: 0 }] } };
      const movedBookmarks = [{ ...node, previous: 'id2' }, { id: 'id2', index: 1, previous: undefined } as any];

      component.onBookmarkMove({ node, to, from });

      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.MoveBookmark(movedBookmarks));
    })
  );
});

