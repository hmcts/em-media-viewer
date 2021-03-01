import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';

import { Rectangle } from '../annotation-view/rectangle/rectangle.model';
import { Annotation } from './annotation.model';
import { reducers } from '../../../store/reducers/reducers';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { AnnotationViewComponent } from './annotation-view.component';

@Component({
  selector: 'mv-ctx-toolbar',
  template: ''
})
class MockCtxToolbarComponent {
  @Input() zoom = 1;
  @Input() rotate = 0;
  @Input() pageHeight: number;
  @Input() pageWidth: number;

  @Input() canHighlight: boolean;
  @Input() canBookmark: boolean;
  @Input() canComment: boolean;
  @Input() canDelete: boolean;
  @Input() rectangles: Rectangle[];

  @Output() createHighlightEvent = new EventEmitter();
  @Output() deleteHighlightEvent = new EventEmitter();
  @Output() addOrEditCommentEvent = new EventEmitter();
  @Output() createBookmarkEvent = new EventEmitter<Rectangle>();
}

@Component({
  selector: 'mv-anno-rectangle',
  template: ''
})
class MockRectangleComponent {
  @Input() color: String;
  @Input() zoom: number;
  @Input() rotate: number;
  @Input() editable: boolean;
  @Input() pageHeight: number;
  @Input() pageWidth: number;
  @Input() annoRect: Rectangle;
  @Input() selected: boolean;

  @Output() select = new EventEmitter<Rectangle>();
  @Output() update = new EventEmitter<Rectangle>();
}

describe('AnnotationViewComponent', () => {
  let component: AnnotationViewComponent;
  let fixture: ComponentFixture<AnnotationViewComponent>;

  const annotation: Annotation = {
    createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
    createdByDetails: {
      forename: 'em-showcase',
      surname: 'testuser',
      email: 'emshowcase@hmcts.net'
    },
    lastModifiedByDetails: {
      forename: 'em-showcase',
      surname: 'testuser',
      email: 'emshowcase@hmcts.net'
    },
    createdDate: '2019-05-28T08:48:19.681Z',
    lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
    lastModifiedDate: '2019-05-28T08:48:33.206Z',
    id: '123',
    page: 1,
    color: 'FFFF00',
    annotationSetId: '8f7aa07c-2343-44e3-b3db-bf689066d00e',
    comments: [],
    rectangles: [{
      annotationId: '123',
      height: 100,
      width: 100,
      x: 50,
      y: 50,
      id: null,
      createdBy: null,
      createdByDetails: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedByDetails: null,
      lastModifiedDate: null
    }],
    type: 'highlight',
    tags: []
  };

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [
        AnnotationViewComponent,
        MockRectangleComponent,
        MockCtxToolbarComponent,
      ],
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers)
      ],
      providers: [{
        provide: ToolbarEventService,
        useValue: {
          toggleCommentsPanel: () => {}
        }
      }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationViewComponent);
    component = fixture.componentInstance;
    component.annotation = annotation;
    fixture.detectChanges();
  });

  it('should emit annotataion click event', () => {
    component.anno = { id: 'annoId' } as any;
    spyOn(component.annotationClick, 'emit');

    component.onSelect();

    expect(component.annotationClick.emit)
      .toHaveBeenCalledWith({ annotationId: 'annoId', editable: false, selected: true });
  });

  it('should update rectangle', () => {
    spyOn(component.update, 'emit');
    component.anno = { rectangles: [{ id: 'rectId' }] } as any;
    const rectangle = { id: 'rectId', height: 100, width: 100 } as any;

    component.onRectangleUpdate(rectangle);

    expect(component.update.emit)
      .toHaveBeenCalledWith({ rectangles: [{ id: 'rectId', height: 100, width: 100 }] } as any);
  });

  it('should delete highlight', () => {
    spyOn(component.delete, 'emit');

    component.deleteHighlight();

    expect(component.delete.emit).toHaveBeenCalled();
  });

  it('should add or edit comment',
    inject([Store, ToolbarEventService], (store, toolbarEvents) => {
      spyOn(store, 'dispatch');
      spyOn(toolbarEvents, 'toggleCommentsPanel');
      spyOn(component.annotationClick, 'emit');
      component.anno = { comments: [], id: 'annoId', createdBy: 'me' } as any;

      component.addOrEditComment();

      expect(store.dispatch).toHaveBeenCalled();
      expect(component.annotationClick.emit)
        .toHaveBeenCalledWith({ annotationId: 'annoId', editable: true, selected: true });
      expect(toolbarEvents.toggleCommentsPanel).toHaveBeenCalledWith(true);
      expect(component.selected).toBeTrue();
  }));

  describe('selectedAnnoId', () => {
    it('should set selected to true when current annotation is selected', () => {
      const mockAnnotationId = '123';
      component.selected = undefined;
      component.selectedAnnoId = { annotationId: mockAnnotationId };
      fixture.detectChanges();

      expect(component.selected).toEqual(true);
    });

    it('should set selected to true when current redaction is selected', () => {
      const mockId = '234';
      component.selected = undefined;
      component.anno.id = undefined;
      component.anno.redactionId = mockId;

      component.selectedAnnoId = { annotationId: mockId };
      fixture.detectChanges();

      expect(component.selected).toEqual(true);
    });

    it('should set selected to false when neiter annotation nor redaction is selected', () => {
      const mockId = '234';
      component.selected = undefined;
      component.anno.redactionId = undefined;

      component.selectedAnnoId = { annotationId: mockId };
      fixture.detectChanges();

      expect(component.selected).toEqual(false);
    });

    it('should set selected to false when selectedId.annotationId is not provided', () => {
      component.selected = undefined;
      component.anno.redactionId = undefined;

      component.selectedAnnoId = { annotationId: null };
      fixture.detectChanges();

      expect(component.selected).toEqual(false);
    });

    it('should not set selected when selectedAnnoId is not provided', () => {
      component.selected = undefined;
      component.selectedAnnoId = null;
      fixture.detectChanges();

      expect(component.selected).toBeUndefined();
    });
  });
});
