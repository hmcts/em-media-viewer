import { PdfJsWrapperFactory } from './pdf-js-wrapper.provider';
import { PdfViewerComponent } from '../pdf-viewer.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessageComponent } from '../../error-message/error.message.component';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommentService } from '../../../annotations/comment-set/comment/comment.service';

describe('PdfJsWrapperFactory', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ PdfViewerComponent, ErrorMessageComponent ],
      providers: [
        ToolbarEventService,
        CommentService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
    })
    .compileComponents();
  }));

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
