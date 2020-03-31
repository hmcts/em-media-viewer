import { AnnotationViewComponent } from './annotation-view.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RectangleComponent } from './rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { PopupToolbarComponent } from './popup-toolbar/popup-toolbar.component';
import { Annotation } from './annotation.model';
import { MutableDivModule } from 'mutable-div';
import {TagsComponent} from '../../tags/tags.component';
import {TagInputModule} from 'ngx-chips';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../../store/reducers';

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
        PopupToolbarComponent,
        TagsComponent
      ],
      imports: [
        FormsModule,
        MutableDivModule,
        TagInputModule,
        StoreModule.forRoot({...reducers})
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

});
