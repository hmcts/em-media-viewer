import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { BookmarksComponent } from './bookmarks.component';
import { Store, StoreModule } from '@ngrx/store';
import * as fromActions from 'projects/media-viewer/src/lib/store/actions/bookmarks.action';
import { reducers } from '../../../../store/reducers';
import { PdfJsWrapperFactory } from '../../pdf-js/pdf-js-wrapper.provider';

describe('BookmarksComponent', () => {
  let component: BookmarksComponent;
  let fixture: ComponentFixture<BookmarksComponent>;
  const mockPdfWrapper = {
    navigateTo: () => {},
    getLocation: () => {}
  };
  const mockPdfWrapperProvider = {
    pdfWrapper: () => mockPdfWrapper
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarksComponent ],
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      providers: [{ provide: PdfJsWrapperFactory, useValue: mockPdfWrapperProvider }]
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

  it('should call navigation method on pdfWrapper',
    inject([PdfJsWrapperFactory],(pdfWrapperProvider) => {
      const navigateSpy = spyOn(pdfWrapperProvider.pdfWrapper(), 'navigateTo');

      component.goToDestination.emit([]);

      expect(navigateSpy).toHaveBeenCalled();
  }));

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
