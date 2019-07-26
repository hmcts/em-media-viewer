import { AnnotationComponent } from './annotation.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentComponent } from '../../comment-set/comment/comment.component';
import { RectangleComponent } from './rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { annotationSet } from '../../../../assets/annotation-set';
import { PopupToolbarComponent } from './popup-toolbar/popup-toolbar.component';
import { EventEmitter } from '@angular/core';

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
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationComponent);
    component = fixture.componentInstance;
    component.annotation = { ...annotationSet.annotations[0] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('select the annotation', async () => {
      component.onSelect();

      expect(component.selected).toBe(true);
  });

  it('deselect the annotation', async () => {
      const relatedTarget = document.createElement('span');
      component.onFocusOut({ relatedTarget } as any);

      expect(component.selected).toBe(false);
  });

  it('create a comment', async () => {
    component.annotation.comments = [];

    component.addOrEditComment();

    expect(component.annotation.comments.length).toBeGreaterThan(0);
    expect(component.annotation.comments[0].annotationId).toEqual(component.annotation.id);
    expect(component.annotation.comments[0].content).toBe('');
    expect(component.annotation.comments[0].createdByDetails).toBe(undefined);
    expect(component.editable).toBe(true);
  });

  it('create a comment', async () => {
    const comments = component.annotation.comments;
    spyOn(comments, 'push');

    component.addOrEditComment();

    expect(comments.push).not.toHaveBeenCalled();
    expect(comments[0].content).not.toBe('');
    expect(comments[0].createdByDetails).not.toBe(undefined);
    expect(component.editable).toBe(true);
  });


  it('deletes a comment', async () => {
    spyOn(component.update, 'emit');

    component.onCommentDelete();

    expect(component.annotation.comments.length).toBe(0);
    expect(component.update.emit).toHaveBeenCalledWith(component.annotation);
  });

  it('updates a comment', async () => {
    component.onCommentUpdate('Updated text');

    expect(component.annotation.comments[0].content).toEqual('Updated text');
  });

  it('delete the annotation', async () => {
    spyOn(component.delete, 'emit');

    const rectangles = { ...component.annotation.rectangles };

    component.deleteHighlight();

    expect(rectangles).not.toEqual(component.annotation.rectangles);
    expect(component.delete.emit).toHaveBeenCalledWith(component.annotation);
  });
});
