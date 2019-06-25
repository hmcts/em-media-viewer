import { AnnotationSetComponent } from './annotation-set.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentComponent } from './annotation/comment/comment.component';
import { RectangleComponent } from './annotation/rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';
import { annotationSet } from '../../../assets/annotation-set';
import { Subject } from 'rxjs';
import { PopupToolbarComponent } from './annotation/rectangle/popup-toolbar/popup-toolbar.component';
import {AnnotationComponent} from './annotation/annotation.component';
import { AnnotationsModule } from '../annotations.module';
import { AnnotationApiService } from '../annotation-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AnnotationSetComponent', () => {
  let component: AnnotationSetComponent;
  let fixture: ComponentFixture<AnnotationSetComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        AnnotationSetComponent,
        AnnotationComponent,
        CommentComponent,
        RectangleComponent,
        PopupToolbarComponent
      ],
      imports: [
        FormsModule,
        AngularDraggableModule,
        HttpClientTestingModule
      ],
      providers: [
        AnnotationApiService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationSetComponent);
    component = fixture.componentInstance;
    component.annotationSet = annotationSet;
    component.page = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
