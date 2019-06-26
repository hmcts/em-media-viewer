import { AnnotationSetComponent } from './annotation-set.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentComponent } from './annotation/comment/comment.component';
import { RectangleComponent } from './annotation/rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';
import { annotationSet } from '../../../assets/annotation-set';
import { PopupToolbarComponent } from './annotation/rectangle/popup-toolbar/popup-toolbar.component';
import { AnnotationComponent } from './annotation/annotation.component';
import { AnnotationApiService } from '../annotation-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('AnnotationSetComponent', () => {
  let component: AnnotationSetComponent;
  let fixture: ComponentFixture<AnnotationSetComponent>;

  const api = new AnnotationApiService({}  as any);

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
        { provide: AnnotationApiService, useValue: api }
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

  it('update annotations', () => {
    const spy = spyOn(api, 'postAnnotationSet').and.returnValues(of(annotationSet));
    const annotation = Object.assign({}, annotationSet.annotations[0]);

    annotation.color = 'red';
    component.onAnnotationUpdate(annotation);

    annotationSet.annotations[0] = annotation;
    expect(spy).toHaveBeenCalledWith(annotationSet);
  });

  it('select an annotation', () => {
    component.onAnnotationSelected(true, 1);

    expect(component.selected).toEqual(1);
  });

  it('deselects an annotation', () => {
    component.onAnnotationSelected(false, 1);

    expect(component.selected).toEqual(-1);
  });

});
