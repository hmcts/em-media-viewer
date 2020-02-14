import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {CommentSetHeaderComponent} from './comment-set-header.component';

describe('CommentSetHeader', () => {
  let component: CommentSetHeaderComponent;
  let fixture: ComponentFixture<CommentSetHeaderComponent>;
  let nativeElement;
  let toolbarEventService: ToolbarEventService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CommentSetHeaderComponent],
      providers: [ToolbarEventService]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentSetHeaderComponent);
    nativeElement = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;
    toolbarEventService = new ToolbarEventService();
    component.showCommentSummary = true
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should emit toggleCommentsSummary event', () => {
    const commentSummarySpy = spyOn(component.showCommentSummaryDialog, 'emit');
    const commentSummaryButton = nativeElement.querySelector('#commentSummary');
    commentSummaryButton.click();

    expect(commentSummarySpy).toHaveBeenCalled();
  });
});
