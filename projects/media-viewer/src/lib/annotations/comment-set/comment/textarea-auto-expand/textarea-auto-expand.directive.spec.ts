import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TextareaAutoExpandDirective } from './textarea-auto-expand.directive';

@Component({
  template: `
      <form>
        <textarea mvTextAreaAutoExpand type="text" name="content">
        </textarea>
      </form>
  `
})
class TestHostComponent {
}

describe('TextareaAutoExpandDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let textareaEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextareaAutoExpandDirective, TestHostComponent],
      providers: [],
      imports: []
    });
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    textareaEl = fixture.debugElement.query(By.css('textarea'));
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
