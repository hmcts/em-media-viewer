import { AnnotationComponent } from './annotation.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentComponent } from './comment/comment.component';
import { RectangleComponent } from './rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';
import { annotationSet } from '../../../../assets/annotation-set';
import { Subject } from 'rxjs';
import { PopupToolbarComponent } from './rectangle/popup-toolbar/popup-toolbar.component';

describe('AnnotationComponent', () => {
  let component: AnnotationComponent;
  let fixture: ComponentFixture<AnnotationComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
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
    fixture = TestBed.createComponent(AnnotationComponent);
    component = fixture.componentInstance;
    component.annotation = { ...annotationSet.annotations[0] } ;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('select the annotation', async () => {
    component.toggleSelection(true);

    expect(component.selected).toBe(true);
  });

  it('deletes a comment', async () => {
    spyOn(component.update, 'emit');

    component.deleteComment();

    expect(component.annotation.comments.length).toBe(0);
    expect(component.update.emit).toHaveBeenCalledWith(component.annotation);
  });

  it('updates a comment', async () => {
    component.onCommentUpdate('Updated text');

    expect(component.annotation.comments[0].content).toEqual('Updated text');
  });
});
