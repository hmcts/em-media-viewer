import { AnnotationViewComponent } from './annotation-view.component';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RectangleComponent } from './rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { CtxToolbarComponent } from '../ctx-toolbar/ctx-toolbar.component';
import { Annotation } from './annotation.model';
import { MutableDivModule } from 'mutable-div';
import {TagsComponent} from '../../tags/tags.component';
import {TagInputModule} from 'ngx-chips';
import { Store, StoreModule } from '@ngrx/store';
import {reducers} from '../../../store/reducers/reducers';
import { ViewerEventService } from '../../../viewers/viewer-event.service';
import {ToolbarEventService} from '../../../toolbar/toolbar-event.service';

describe('AnnotationComponent', () => {
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
    rectangles: [],
    type: 'highlight',
    tags: []
  };

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [
        AnnotationViewComponent,
        RectangleComponent,
        CtxToolbarComponent,
        TagsComponent
      ],
      imports: [
        FormsModule,
        MutableDivModule,
        TagInputModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationViewComponent);
    component = fixture.componentInstance;
    component.annotation = annotation;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

    expect(component.update.emit).toHaveBeenCalled();
    expect(component.anno.rectangles[0].width).toBe(100);
    expect(component.anno.rectangles[0].height).toBe(100);
  });

  it('should delete highlight', () => {
    spyOn(component.delete, 'emit');

    component.deleteHighlight();

    expect(component.delete.emit).toHaveBeenCalled();
  });

  it('should add or edit comment',
    inject([Store, ToolbarEventService],(store, toolbarEvents) => {
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
});
