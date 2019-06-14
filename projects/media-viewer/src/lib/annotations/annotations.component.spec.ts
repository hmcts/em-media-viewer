import { AnnotationsComponent } from './annotations.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentComponent } from './comment/comment.component';
import { RectangleComponent } from './rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';
import { annotationSet } from '../stub-annotation-data/annotation-set';
import { DebugElement } from '@angular/core';

describe('AnnotationsComponent', () => {
  let component: AnnotationsComponent;
  let fixture: ComponentFixture<AnnotationsComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        AnnotationsComponent,
        CommentComponent,
        RectangleComponent
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

    component.annotationSet = JSON.parse(JSON.stringify(annotationSet));
    fixture.detectChanges();

    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('select a comment', () => {
    const commentElements = debugElement.nativeElement.querySelectorAll('form.aui-comment');

    commentElements[1].click();
    expect(component.selectedIndex).toBe(1);
  });

  it('select a rectangle', () => {
    const commentElements = debugElement.nativeElement.querySelectorAll('div.rectangle');

    commentElements[1].click();
    expect(component.selectedIndex).toBe(1);
  });

  it('deselect', () => {
    const commentElements = debugElement.nativeElement.querySelectorAll('form.aui-comment');

    commentElements[1].click();
    expect(component.selectedIndex).toBe(1);

    const container = debugElement.nativeElement.querySelector('.annotations-container');
    container.click();

    expect(component.selectedIndex).toBe(-1);
  });

  it('deletes a comment', async () => {
    const commentElements = debugElement.nativeElement.querySelectorAll('form.aui-comment');

    commentElements[0].click();
    fixture.detectChanges();

    return new Promise(resolve => {
      component.update.subscribe(as => {
        expect(as.annotations[0].comments.length).toBe(0);

        resolve();
      });

      const buttons = commentElements[0].querySelectorAll('button');
      buttons[1].click();
    });

  });

});
