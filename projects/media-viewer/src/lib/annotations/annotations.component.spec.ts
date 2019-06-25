import { AnnotationsComponent } from './annotations.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentComponent } from './comment/comment.component';
import { RectangleComponent } from './rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';
import { annotationSet } from '../../assets/annotation-set';
import { Subject } from 'rxjs';
import { PopupToolbarComponent } from './rectangle/popup-toolbar/popup-toolbar.component';
import {AnnotationComponent} from './annotation.component';

describe('AnnotationsComponent', () => {
  let component: AnnotationsComponent;
  let fixture: ComponentFixture<AnnotationsComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        AnnotationsComponent,
        AnnotationComponent,
        CommentComponent,
        RectangleComponent,
        PopupToolbarComponent
      ],
      imports: [
        FormsModule,
        AngularDraggableModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationsComponent);
    component = fixture.componentInstance;
    component.annotations = [{ ...annotationSet.annotations[0] }] ;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
