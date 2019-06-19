import { AnnotationsComponent } from './annotations.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentComponent } from './comment/comment.component';
import { RectangleComponent } from './rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';
import { annotationSet } from '../stub-annotation-data/annotation-set';
import { DebugElement } from '@angular/core';
import { AnnotationApiService } from './annotation-api.service';
import { HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { PopupToolbarComponent } from './rectangle/popup-toolbar/popup-toolbar.component';

describe('AnnotationsComponent', () => {
  const mockApi = {
    postAnnotationSet: () => new Subject()
  };
  let component: AnnotationsComponent;
  let fixture: ComponentFixture<AnnotationsComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AnnotationsComponent,
        CommentComponent,
        RectangleComponent,
        PopupToolbarComponent
      ],
      imports: [
        FormsModule,
        AngularDraggableModule,
        HttpClientModule
      ],
      providers: [
        { provide: AnnotationApiService, useValue: mockApi }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotationsComponent);
    component = fixture.componentInstance;

    component.annotationSet = JSON.parse(JSON.stringify(annotationSet));
    fixture.detectChanges();

    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('select a comment', () => {
    const commentElements = debugElement.nativeElement.querySelectorAll('form.aui-comment');

    commentElements[0].click();
    expect(component.selectedIndex).toBe(0);
  });

  it('select a rectangle', () => {
    const commentElements = debugElement.nativeElement.querySelectorAll('div.rectangle');

    commentElements[0].click();
    expect(component.selectedIndex).toBe(0);
  });

  it('deselect', () => {
    const commentElements = debugElement.nativeElement.querySelectorAll('form.aui-comment');

    commentElements[0].click();
    expect(component.selectedIndex).toBe(0);

    const container = debugElement.nativeElement.querySelector('.annotations-container');
    container.click();

    expect(component.selectedIndex).toBe(-1);
  });

  it('deletes a comment', async () => {
    const commentElements = debugElement.nativeElement.querySelectorAll('form.aui-comment');

    commentElements[1].click();
    fixture.detectChanges();

    const spy = spyOn(component, 'deleteComment');
    const buttons = commentElements[1].querySelectorAll('button');
    buttons[1].click();

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('updates a comment', async () => {
    component.updateComment(0, 'Updated text');

    expect(component.annotationSet.annotations[0].comments[0].content).toEqual('Updated text');
  });
});
