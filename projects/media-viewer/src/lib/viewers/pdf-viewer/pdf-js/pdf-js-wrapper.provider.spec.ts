import { PdfJsWrapperFactory } from './pdf-js-wrapper.provider';
import { PdfViewerComponent } from '../pdf-viewer.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommentService } from '../../../annotations/comment-set/comment/comment.service';
import { AnnotationApiService } from '../../../annotations/annotation-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GrabNDragDirective } from '../../grab-n-drag.directive';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../../store/reducers';

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
      imports: [HttpClientTestingModule, StoreModule.forFeature('media-viewer', reducers), StoreModule.forRoot({}),],
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
