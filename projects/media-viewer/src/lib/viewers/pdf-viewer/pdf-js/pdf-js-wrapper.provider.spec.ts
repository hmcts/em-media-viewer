import { PdfJsWrapperFactory } from './pdf-js-wrapper.provider';
import { PdfViewerComponent } from '../pdf-viewer.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GrabNDragDirective } from '../../grab-n-drag.directive';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../../store/reducers';
import { HighlightCreateService } from '../../../annotations/annotation-set/annotation-create/highlight-create.service';

describe('PdfJsWrapperFactory', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfViewerComponent, GrabNDragDirective],
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      providers: [ToolbarEventService, { provide: HighlightCreateService, useValue: {} }],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
  });

  it('creates a wrapper', () => {
    const factory = new PdfJsWrapperFactory(new ToolbarEventService());
    const wrapper = factory.create(component.viewerContainer);

    expect(wrapper).not.toBeNull();
    expect(wrapper.documentLoadInit).toBeInstanceOf(Subject);
    expect(wrapper.documentLoadProgress).toBeInstanceOf(Subject);
    expect(wrapper.documentLoaded).toBeInstanceOf(Subject);
    expect(wrapper.outlineLoaded).toBeInstanceOf(Subject);
    expect(wrapper.documentLoadFailed).toBeInstanceOf(Subject);
    expect(wrapper.pageRendered).toBeInstanceOf(Subject);
    expect(wrapper.positionUpdated).toBeInstanceOf(Subject);
  });
});
