import { AnnotationSetComponent } from './annotation-set.component';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RectangleComponent } from './annotation-view/rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { annotationSet } from '../../../assets/annotation-set';
import { PopupToolbarComponent } from './annotation-view/popup-toolbar/popup-toolbar.component';
import { AnnotationViewComponent } from './annotation-view/annotation-view.component';
import { AnnotationApiService } from '../annotation-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { CommentService } from '../comment-set/comment/comment.service';
import { MutableDivModule } from 'mutable-div';
import { HighlightCreateService } from './annotation-create/highlight-create.service';
import { BoxHighlightCreateComponent } from './annotation-create/box-highlight-create.component';
import { Highlight, ViewerEventService } from '../../viewers/viewer-event.service';
import { TagsComponent } from '../tags/tags.component';
import { TagInputModule } from 'ngx-chips';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../store/reducers';

describe('AnnotationSetComponent', () => {
  let component: AnnotationSetComponent;
  let fixture: ComponentFixture<AnnotationSetComponent>;
  let mockTextLayerRect, mockElement, mockHighlight, mockClientRect, mockClientRects, mockRange;

  const api = new AnnotationApiService({}  as any);
  const mockCommentService = new CommentService();

  const fakeApi: any = {
    returnedAnnotation: {
      id: 'testId',
      annotationSetId: 'testAnnotationSetId',
      color: 'FFFF00',
      comments: [],
      page: 1,
      rectangles: [],
      type: 'highlight'
    },
    postAnnotation(annotation: any): Observable<any> {
      fakeApi.returnedAnnotation.id = annotation.id;
      fakeApi.returnedAnnotation.annotationSetId = annotation.annotationSetId;
      fakeApi.returnedAnnotation.page = annotation.page;
      fakeApi.returnedAnnotation.rectangles = annotation.rectangles;
      return of(fakeApi.returnedAnnotation);
    }
  };

  beforeEach(() => {
    mockTextLayerRect = {
      top: 0,
      left: 0,
    };

    mockElement = {
      parentElement: {
        getBoundingClientRect(): unknown {
          return mockTextLayerRect;
        },
        childNodes: [{
          style: {
            padding: '100px 100px 100px 100px',
            transform: 'scaleX(0.01) translateX(100px) translateY(-0.1)'
          }
        },
          {
            style: {
              padding: '100px 100px 100px 100px',
              transform: 'scaleX(0.01) translateX(100) translateY(-0.1px)'
            }
          }]
      }
    };

    mockHighlight = {
      page: 1,
      event: {
        pageY: 10,
        pageX: 10,
        target: mockElement,
        srcElement: mockElement
      } as any,
    };

    mockClientRect = {
      top: 10,
      bottom: 100,
      left: 25,
      right: 100,
    };

    mockClientRects = [mockClientRect, mockClientRect];
    mockRange = {
      cloneRange(): any {
        return mockRange;
      },
      getClientRects(): any {
        return mockClientRects;
      }
    };

  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AnnotationSetComponent,
        AnnotationViewComponent,
        BoxHighlightCreateComponent,
        RectangleComponent,
        PopupToolbarComponent,
        TagsComponent
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MutableDivModule,
        TagInputModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer' , reducers)
      ],
      providers: [
        { provide: AnnotationApiService, useValue: api },
        { provide: CommentService, useValue: mockCommentService },
        ToolbarEventService,
        HighlightCreateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationSetComponent);
    component = fixture.componentInstance;
    component.annotationSet = JSON.parse(JSON.stringify(annotationSet));
    component.rotate = 0;
    component.height = 400;
    component.width = 200;
    component.zoom = 1;
    fixture.detectChanges();

    spyOn(mockHighlight.event, 'target').and.returnValue(mockElement);
    spyOn(mockHighlight.event, 'srcElement').and.returnValue(mockElement);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create text highlight',
    inject([HighlightCreateService, ViewerEventService],
      fakeAsync((highlightService, viewerEvents) => {
        spyOn(highlightService, 'getRectangles');
        component.ngOnInit();

        viewerEvents.textSelected({ page: 1 } as Highlight);
        tick();

        expect(highlightService.getRectangles).toHaveBeenCalledWith({ page: 1 });
    })
  ));


});
