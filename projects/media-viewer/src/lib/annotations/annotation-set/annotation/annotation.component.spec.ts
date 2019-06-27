import { AnnotationComponent } from './annotation.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentComponent } from './comment/comment.component';
import { RectangleComponent } from './rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';
import { annotationSet } from '../../../../assets/annotation-set';
import { PopupToolbarComponent } from './rectangle/popup-toolbar/popup-toolbar.component';
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
        FormsModule,
        AngularDraggableModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationComponent);
    component = fixture.componentInstance;
    component.annotation = { ...annotationSet.annotations[0] };
    component.select = new EventEmitter<boolean>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('select the annotation', async () => {
    await new Promise(resolve => {
      component.select.subscribe(selected => {
        expect(selected).toBe(true);
        resolve();
      });
      component.toggleSelection(true);
    });
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

  it('remove the rectangle from the annotation', async () => {
    component.annotation = { ...annotationSet.annotations[0] };
    const additionalRectangle = { ...component.annotation.rectangles[0] };
    additionalRectangle.id = 'additional-rectangle-id-1234';
    component.annotation.rectangles = [ ...component.annotation.rectangles ];
    component.annotation.rectangles.push(additionalRectangle);
    spyOn(component.update, 'emit');
    const rectangles = { ...component.annotation.rectangles };

    component.onRectangleDelete('additional-rectangle-id-1234');

    expect(component.update.emit).toHaveBeenCalledWith(component.annotation);
    expect(rectangles).not.toEqual(component.annotation.rectangles);
  });

  it('delete the annotation', async () => {
    component.annotation = { ...annotationSet.annotations[0] };
    const rectangleId = component.annotation.rectangles[0].id;
    spyOn(component.delete, 'emit');

    expect(component.annotation.rectangles.length).toBe(1);

    const rectangles = { ...component.annotation.rectangles };

    component.onRectangleDelete(rectangleId);

    expect(rectangles).not.toEqual(component.annotation.rectangles);
    expect(component.delete.emit).toHaveBeenCalledWith(component.annotation);
  });
});
