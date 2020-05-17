import { PdfJsWrapperFactory } from './pdf-js-wrapper.provider';
import { PdfViewerComponent } from '../pdf-viewer.component';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommentService } from '../../../annotations/comment-set/comment/comment.service';
import { AnnotationApiService } from '../../../annotations/annotation-api.service';
import { GrabNDragDirective } from '../../grab-n-drag.directive';
import { Store, StoreModule } from '@ngrx/store';
import {reducers} from '../../../store/reducers/reducers';

describe('PdfJsWrapperFactory', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [
        PdfViewerComponent,
        GrabNDragDirective
      ],
      providers: [
        ToolbarEventService,
        CommentService,
        AnnotationApiService
      ],
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

  it('creates a wrapper', inject([Store], (store) => {
    const factory = new PdfJsWrapperFactory(new ToolbarEventService(), store);
    const wrapper = factory.create(component.viewerContainer);

    expect(wrapper).not.toBeNull();
  }));

});
