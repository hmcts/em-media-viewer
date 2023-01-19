import { SimpleChange, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';

import { SideBarComponent } from './side-bar.component';
import { OutlineItemComponent } from './outline-item/outline-item.component';
import { reducers } from '../../../store/reducers/reducers';
import { PdfJsWrapperFactory } from '../pdf-js/pdf-js-wrapper.provider';
import { PdfPositionUpdate } from '../../../store/actions/document.actions';
import { ViewerEventService } from '../../viewer-event.service';
import * as fromDocument from '../../../store/actions/document.actions';
import { CreateBookmark, LoadBookmarks } from '../../../store/actions/bookmark.actions';
import { Outline } from './outline-item/outline.model';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;
  const mockPdfWrapper = {
    navigateTo: () => {},
    getLocation: () => {}
  };
  const mockPdfWrapperProvider = {
    pdfWrapper: () => mockPdfWrapper
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarComponent, OutlineItemComponent ],
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      providers: [{ provide: PdfJsWrapperFactory, useValue: mockPdfWrapperProvider }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger goToDestination event on viewerEvents',
    inject([ViewerEventService], (viewerEvents) => {
      spyOn(viewerEvents, 'goToDestination');

      component.goToDestination([]);

      expect(viewerEvents.goToDestination).toHaveBeenCalledWith([]);
  }));

  it('should toggle sidebar view', () => {
    component.selectedView = 'bookmarks';

    component.toggleSidebarView('outline');

    expect(component.selectedView).toBe('outline');
  });

  it('should dispatch CreateBookmark action',
    inject([Store], fakeAsync((store) => {

      store.dispatch(new fromDocument.AddPages([{div: {}, scale: 1, rotation: 0, id: '1', viewportScale: 1.333333}]));
      store.dispatch(new PdfPositionUpdate({ pageNumber: 1, top: 50, left: 30, rotation: 0, scale: 1 }));
      spyOn(store, 'dispatch');

      component.onAddBookmarkClick();
      tick();

      expect(store.dispatch).toHaveBeenCalled();
      expect(component.selectedView).toBe('bookmarks');
    }))
  );

  it('should dispatch LoadBookmarks action on change',
    inject([Store], (store: Store<{}>) => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.url = 'prev-url';

      component.ngOnChanges({
        url: new SimpleChange('prev-url', 'new-url', false)
      });

      expect(dispatchSpy).toHaveBeenCalledWith(new LoadBookmarks());
    })
  );

  it('should identify if currently viewed item', () => {
    const outline = <Outline> {};
    outline.pageNumber = 1;
    component.currentPageNumber = 1;
    expect(component.isViewedItem(outline, undefined)).toBe(true);
    component.currentPageNumber = 2;
    expect(component.isViewedItem(outline, undefined)).toBe(true);
    component.currentPageNumber = 0;
    expect(component.isViewedItem(outline, undefined)).toBe(false);

    const nextOutline = <Outline> {};
    nextOutline.pageNumber = 2;
    component.currentPageNumber = 1;
    expect(component.isViewedItem(outline, nextOutline)).toBe(true);
    component.currentPageNumber = 2;
    expect(component.isViewedItem(outline, nextOutline)).toBe(false);
  });

  it('should find the ending page number', () => {
    expect(component.findEndPage(undefined)).toBe(Number.MAX_SAFE_INTEGER);
    const nextOutline = <Outline> {};
    nextOutline.pageNumber = Math.floor(Math.random() * 10000);
    expect(component.findEndPage(nextOutline)).toBe(nextOutline.pageNumber);
  });
});
