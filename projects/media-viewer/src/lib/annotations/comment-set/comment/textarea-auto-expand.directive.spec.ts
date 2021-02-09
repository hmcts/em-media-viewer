import { CommentComponent } from './comment.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { TagInputModule } from 'ngx-chips';

import { TextareaAutoExpandDirective } from './textarea-auto-expand.directive';
import { CommentService } from './comment.service';
import { TextHighlightDirective } from './text-highlight.directive';
import { TagsComponent } from '../../tags/tags.component';
import { TagsServices } from '../../services/tags/tags.services';
import { MomentDatePipe } from '../../pipes/date/date.pipe';
import {reducers} from '../../../store/reducers/reducers';

describe('TextareaAutoExpandDirective', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;
  let textareaEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextareaAutoExpandDirective, CommentComponent, TextHighlightDirective, TagsComponent, MomentDatePipe],
      providers: [CommentService, TagsServices, CommentService],
      imports: [BrowserAnimationsModule, FormsModule, TagInputModule, HttpClientTestingModule,
        StoreModule.forFeature('media-viewer', reducers), StoreModule.forRoot({})]
    });
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    component.selected = true;
    component._comment = {
      annotationId: '123',
    } as any
    component._editable = true;
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
