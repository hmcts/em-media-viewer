import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { BookmarksComponent } from './bookmarks.component';
import { Bookmark } from '../../../../store/models/bookmarks.interface';
import * as fromActions from '../../../../store/actions/bookmark.actions';
import { State } from 'projects/media-viewer/src/lib/store/reducers/reducers';
import { off } from 'process';

describe('BookmarksComponent', () => {
  let component: BookmarksComponent;
  let fixture: ComponentFixture<BookmarksComponent>;
  let store: Store<State>;

  const bookmarkNode = {
    parent: { children: [{}] },
    index: 0,
    data: { id: 'bookmarkId', children: [], index: 0 }
  } as any;

  const bookmarkNodeWithChildren = {
    data: { id: 'bookmarkId', children: [{ id: 'bookmarkId2', children: [], index: 1 }], index: 0 }
  } as any;

  const bookmarks = [
    { id: 1, name: 'root1', next: 4, index: 0, pageNumber: 1, yCoordinate: 70 },
    { id: 2, name: 'child1', parent: 1, next: 3, index: 1, pageNumber: 1, yCoordinate: 50 },
    { id: 3, name: 'child2', parent: 1, previous: 2, index: 2, pageNumber: 2, yCoordinate: 50 },
    { id: 5, name: 'child2.1', parent: 4, next: 6, index: 3, pageNumber: 4, yCoordinate: 30 },
    { id: 7, name: 'subsub', parent: 6, index: 4, pageNumber: 6, yCoordinate: 50 },
    { id: 4, name: 'root2', previous: 1, index: 5, pageNumber: 5, yCoordinate: 50 },
    { id: 6, name: 'child2.2', parent: 4, previous: 5, index: 6, pageNumber: 3, yCoordinate: 50 }
  ] as any;

  const orderedBookmarks = [
    { id: 2, name: 'child1', parent: 1, next: 3, index: 1, pageNumber: 1, yCoordinate: 50 },
    { id: 1, name: 'root1', next: 4, index: 0, pageNumber: 1, yCoordinate: 70 },
    { id: 3, name: 'child2', parent: 1, previous: 2, index: 2, pageNumber: 2, yCoordinate: 50 },
    { id: 6, name: 'child2.2', parent: 4, previous: 5, index: 6, pageNumber: 3, yCoordinate: 50 },
    { id: 5, name: 'child2.1', parent: 4, next: 6, index: 3, pageNumber: 4, yCoordinate: 30 },
    { id: 4, name: 'root2', previous: 1, index: 5, pageNumber: 5, yCoordinate: 50 },
    { id: 7, name: 'subsub', parent: 6, index: 4, pageNumber: 6, yCoordinate: 50 }
  ] as any;

  const treeModelMock = jasmine.createSpyObj('TreeModel', {
    'update': null,
    'getNodeById': bookmarkNode
  },
    {
      nodes: bookmarks
    }
  );

  const initialState = {
    'media-viewer': {
      bookmarks: {
        editableBookmark: '123',
        bookmarkEntities: {}
      },
      document: {
        pages: {
          '1': {
            viewportScale: 1,
            styles: {
              height: 300
            },
            scaleRotation: {
              scale: 1
            }
          }
        },
        pdfPosition: { pageNumber: 1, top: 50, left: 30, rotation: 0, scale: 1 }
      }
    }
  };

  const dropEventMock = jasmine.createSpyObj('CdkDragDrop', ['previousContainer', 'container'], { item: { data: {} }, isPointerOverContainer: true, previousIndex: 0, currentIndex: 1 });
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookmarksComponent],
      providers: [
        provideMockStore({ initialState })
      ],
      imports: [
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(BookmarksComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
    component.bookmarkNodes = bookmarks;
    component.tree = jasmine.createSpyObj('TreeComponent', ['treeModel']);
    component.tree.treeModel = treeModelMock;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch CreateBookmark action', fakeAsync(() => {

    spyOn(store, 'dispatch');
    component.onAddBookmarkClick();
    tick();

    expect(store.dispatch).toHaveBeenCalled();
  })
  );

  it('should new delete bookmark', () => {
    spyOn(store, 'dispatch');
    component.bookmarkNodes = bookmarkNodeWithChildren.data;
    component.deleteBookmark2(bookmarkNodeWithChildren.data);
    expect(store.dispatch).toHaveBeenCalledWith(new fromActions.DeleteBookmark({
      deleted: ['bookmarkId', 'bookmarkId2'], updated: undefined
    }));
  });

  it('should update bookmark', () => {
    spyOn(store, 'dispatch');
    const mockBookmark = { name: 'Bookmark name', id: 'id' } as any;
    const newName = 'Bookmark new name';
    component.updateBookmark(mockBookmark, newName);
    mockBookmark.name = newName;
    expect(store.dispatch).toHaveBeenCalledWith(new fromActions.UpdateBookmark(mockBookmark));
  });

  it('should not update bookmark name is null or empty', () => {
    spyOn(store, 'dispatch');
    const mockBookmark = { name: 'Bookmark name', id: 'id' } as any;
    const newName = '';
    component.updateBookmark(mockBookmark, newName);
    mockBookmark.name = newName;
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  // it('should move bookmarks', () => {
  //   spyOn(store, 'dispatch');
  //   const node = {
  //     documentId: '7547364e-5e49-452b-82e9-8d4b8a334a53',
  //     id: 'id1',
  //     index: 0,
  //     name: 'new bookmark',
  //     parent: undefined,
  //     previous: undefined
  //   };

  //   const from = { index: 0, parent: { children: [{ id: 'id2', index: 1 }, { id: 'id1', index: 0 }] } };
  //   const to = { index: 1, parent: { children: [{ id: 'id2', index: 1 }, { id: 'id1', index: 0 }] } };
  //   const movedBookmarks = [{ ...node, previous: 'id2' }, { id: 'id2', index: 1, previous: undefined } as any];

  //   component.onBookmarkMove({ node, to, from });

  //   expect(store.dispatch).toHaveBeenCalledWith(new fromActions.MoveBookmark(movedBookmarks));
  // });

  it('should set editableBookmark', () => {
    const mockId = '123';
    component.editBookmark(mockId);
    expect(component.editableBookmark).toEqual(mockId);
  });

  it('should sort by position', () => {
    component.sort(component.positionSort);
    expect(component.bookmarkNodes).toEqual(orderedBookmarks);
  });

  it('should sort by custom order', () => {
    component.sort(component.positionSort);
    expect(component.bookmarkNodes).toEqual(orderedBookmarks);
    component.sort(component.customSort);
    expect(component.bookmarkNodes).toEqual(bookmarks);
  });

  it('should default to custom sort', () => {
    component.sort(component.positionSort);
    expect(component.bookmarkNodes).toEqual(orderedBookmarks);
    component.sort('UNKNOWN SORT MODE');
    expect(component.bookmarkNodes).toEqual(bookmarks);
  });

  describe('goToBookmark', () => {
    const mockBookmark = {
      pageNumber: 0,
      yCoordinate: 100
    };

    const bookmarks = JSON.parse(`[{"id":"8816fd4b-bed5-46df-9315-a8f40080c720","name":"2","previous": null ,"index":0},
    {"id":"a1374cbc-1e28-4f49-91e5-7793e0a183a3","name":"6","parent":null,"previous":"8816fd4b-bed5-46df-9315-a8f40080c720","index":1},
    {"id":"a21309f9-0e65-46f1-9a58-40605d1fa851","name":"5","parent":null,"previous":"a1374cbc-1e28-4f49-91e5-7793e0a183a3","index":2,
    "children":[{"id":"69a98ad2-9418-4eec-bf2a-7981e3fec1db","name":"4","parent":"a21309f9-0e65-46f1-9a58-40605d1fa851","previous":null,"index":0}]}]`) as Bookmark[];

    it('should emit goToDestination event no rotation', () => {
      component.zoom = 1;
      fixture.detectChanges();

      spyOn(component.goToDestination, 'emit').and.callThrough();
      component.goToBookmark(mockBookmark as Bookmark);

      expect(component.goToDestination.emit).toHaveBeenCalledWith([
        mockBookmark.pageNumber,
        { 'name': 'XYZ' },
        0,
        200
      ]);
    });

    it('should emit goToDestination event no ratation, zoom = 2', () => {
      component.zoom = 2;
      fixture.detectChanges();

      spyOn(component.goToDestination, 'emit').and.callThrough();
      component.goToBookmark(mockBookmark as Bookmark);

      expect(component.goToDestination.emit).toHaveBeenCalledWith([
        mockBookmark.pageNumber,
        { 'name': 'XYZ' },
        0,
        100
      ]);
    });

    it('should emit goToDestination event with ratation = 90deg, zoom = 2', () => {
      component.zoom = 2;
      component.rotate = 90;
      fixture.detectChanges();

      spyOn(component.goToDestination, 'emit').and.callThrough();
      component.goToBookmark(mockBookmark as Bookmark);

      expect(component.goToDestination.emit).toHaveBeenCalledWith([
        mockBookmark.pageNumber,
        { 'name': 'XYZ' },
        -100,
        0
      ]);
    });

    it('should emit goToDestination event with ratation = 180deg, no zoom', () => {
      component.zoom = 1;
      component.rotate = 180;
      fixture.detectChanges();

      spyOn(component.goToDestination, 'emit').and.callThrough();
      component.goToBookmark(mockBookmark as Bookmark);

      expect(component.goToDestination.emit).toHaveBeenCalledWith([
        mockBookmark.pageNumber,
        { 'name': 'XYZ' },
        0,
        176
      ]);
    });

    it('should emit goToDestination event with ratation = 270deg, zoom = 3', () => {
      component.zoom = 3;
      component.rotate = 270;
      fixture.detectChanges();

      spyOn(component.goToDestination, 'emit').and.callThrough();
      component.goToBookmark(mockBookmark as Bookmark);

      expect(component.goToDestination.emit).toHaveBeenCalledWith([
        mockBookmark.pageNumber,
        { 'name': 'XYZ' },
        0,
        0
      ]);
    });

    it('should drop when bookmark is moved to a new location', () => {
      spyOn(store, 'dispatch');
      dropEventMock.isPointerOverContainer = true;
      dropEventMock.item.data = bookmarks[0];
      dropEventMock.isPointerOverContainer = true;

      component.bookmarkNodes = bookmarks;
      component.dragNodeInsertToParent = false
      component.drop(dropEventMock)

      const nodeMoved1 = { ...bookmarks[1], previous: null };
      const nodeMoved2 = { ...bookmarks[0], previous: bookmarks[1].id, parent: undefined };
      const nodeMoved3 = { ...bookmarks[2], previous: bookmarks[0].id };


      const movedBookmarks = [nodeMoved2, nodeMoved1, nodeMoved3];

      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.MoveBookmark(movedBookmarks));

    });

    it('should drop when bookmark is moved into parent node', () => {
      spyOn(store, 'dispatch');
      dropEventMock.isPointerOverContainer = true;
      dropEventMock.item.data = bookmarks[0];
      dropEventMock.isPointerOverContainer = true;

      component.bookmarkNodes = bookmarks;
      component.dragNodeInsertToParent = true
      component.drop(dropEventMock)

      const nodeMoved1 = { ...bookmarks[1], previous: undefined, parent: null };
      const nodeMoved2 = { ...bookmarks[0], previous: null, parent: bookmarks[1].id };

      const movedBookmarks = [nodeMoved2, nodeMoved1];

      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.MoveBookmark(movedBookmarks));

    });

    it('should start drag', () => {
      component.dragStart();
      expect(component.dragNodeInsertToParent).toEqual(false);
      expect(component.dragging).toEqual(true);
    });

    it('should end drag', () => {
      component.dragEnd();
      expect(component.dragging).toEqual(false);
    });

    it('should drag hover start on mouse enter', fakeAsync(() => {
      const nodeWithDragHover = bookmarks[0];
      spyOn(component.treeControl, "expand");
      spyOn(window, 'clearTimeout');
      component.dragging = true;

      const dragEvent = jasmine.createSpyObj('MouseEnter', ['preventDefault'], { offsetX: 1, offsetY: 0, target: { clientWidth: 3 } });
      component.dragHover(dragEvent, nodeWithDragHover);
      tick(1000);

      expect(component.treeControl.expand).toHaveBeenCalled();
      expect(window.clearTimeout).toHaveBeenCalled();
      expect(component.dragNodeInsertToParent).toEqual(true);
    }));

    it('should drag hover end on mouse leave', fakeAsync(() => {
      const nodeWithDragHover = bookmarks[0];
      spyOn(window, 'clearTimeout');
      component.dragging = true;

      const dragEvent = jasmine.createSpyObj('MouseEnter', ['preventDefault'], { offsetX: 1, offsetY: 0, target: { clientWidth: 3 } });
      component.dragHoverEnd(dragEvent, nodeWithDragHover);
      tick(1000);

      expect(window.clearTimeout).toHaveBeenCalled();
    }));

    it('should call on node expand when expanded', fakeAsync(() => {
      const node = bookmarks[0];
      spyOn(component.treeControl, 'isExpanded').and.returnValue(true);

      const result = component.onNodeExpand(node);
      expect(result).toEqual("toggle-children-wrapper-expanded");
    }));

    it('should call on node expand when collapsed', fakeAsync(() => {
      const node = bookmarks[0];
      spyOn(component.treeControl, 'isExpanded').and.returnValue(false);

      const result = component.onNodeExpand(node);
      expect(result).toEqual("toggle-children-wrapper-collapsed");
    }));
  });
});
