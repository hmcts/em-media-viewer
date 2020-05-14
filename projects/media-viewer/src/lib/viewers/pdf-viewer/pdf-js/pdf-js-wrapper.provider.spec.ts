import { PdfJsWrapperFactory } from './pdf-js-wrapper.provider';
import { PdfViewerComponent } from '../pdf-viewer.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GrabNDragDirective } from '../../grab-n-drag.directive';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../../store/reducers';
import { HighlightCreateService } from '../../../annotations/annotation-set/annotation-create/highlight-create.service';

describe('PdfJsWrapperFactory', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [
        PdfViewerComponent,
        GrabNDragDirective
      ],
      providers: [ToolbarEventService, { provide: HighlightCreateService, useValue: {} }],
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
  });

  it('creates a wrapper', () => {
    const factory = new PdfJsWrapperFactory(new ToolbarEventService());
    const wrapper = factory.create(component.viewerContainer);

    expect(wrapper).not.toBeNull();
  });

});
