import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { SideBarComponent } from './side-bar.component';
import { OutlineItemComponent } from './outline-item/outline-item.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../../store/reducers';
import { PdfJsWrapperFactory } from '../pdf-js/pdf-js-wrapper.provider';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
});
