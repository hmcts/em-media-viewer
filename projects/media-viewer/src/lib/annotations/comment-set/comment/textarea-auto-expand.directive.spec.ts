import { TextareaAutoExpandDirective } from './textarea-auto-expand.directive';
import { CommentComponent } from './comment.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommentService } from './comment.service';

describe('TextareaAutoExpandDirective', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;
  let textareaEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextareaAutoExpandDirective, CommentComponent],
      providers: [CommentService],
      imports: [FormsModule]
    });
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    component.selected = true;
    fixture.detectChanges();
    textareaEl = fixture.debugElement.query(By.css('textarea'));
  });

  it('should create an instance', () => {
    const directive = new TextareaAutoExpandDirective(textareaEl);
    expect(directive).toBeTruthy();
  });

  it('input into textarea', () => {
    textareaEl.nativeElement.value = 'test';
    const initialHeight = textareaEl.nativeElement.style.height;

    textareaEl.nativeElement.value = 'testing the comment height when a large amount of text is enter' +
      ' so the initial height will not be the same as the final height. testing the comment height when a large amount of text is enter' +
      ' so the initial height will not be the same as the final height, testing the comment height when a large amount of text is enter' +
      ' so the initial height will not be the same as the final height, testing the comment height when a large amount of text is enter' +
      ' so the initial height will not be the same as the final height';
    fixture.detectChanges();

    expect(textareaEl.nativeElement.style.height).not.toEqual(initialHeight);
  });
});
