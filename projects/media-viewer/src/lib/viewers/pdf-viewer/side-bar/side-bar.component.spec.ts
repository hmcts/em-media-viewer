import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { SideBarComponent } from './side-bar.component';
import { OutlineItemComponent } from './outline-item/outline-item.component';
import { Store, StoreModule } from '@ngrx/store';
import { reducers } from '../../../store/reducers/reducers';
import { PdfJsWrapperFactory } from '../pdf-js/pdf-js-wrapper.provider';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UpdatePdfPosition } from '../../../store/actions/bookmarks.action';

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

  it('should call navigation method on pdfWrapper',
    inject([PdfJsWrapperFactory],(pdfWrapperProvider) => {
      const navigateSpy = spyOn(pdfWrapperProvider.pdfWrapper(), 'navigateTo');

      component.goToDestination([]);

      expect(navigateSpy).toHaveBeenCalled();
  }));

  it('should toggle sidebar view', () => {
    component.selectedView = 'bookmarks';

    component.toggleSidebarView('outline');

    expect(component.selectedView).toBe('outline');
  });

  it('should dispatch CreateBookmark action',
    inject([Store], fakeAsync((store) => {
      store.dispatch(new UpdatePdfPosition({ pageNumber: 1, top: 50, left: 30 } as any));
      spyOn(store, 'dispatch');

      component.onAddBookmarkClick();
      tick();

      expect(store.dispatch).toHaveBeenCalled();
      expect(component.selectedView).toBe('bookmarks')
    }))
  );
});
