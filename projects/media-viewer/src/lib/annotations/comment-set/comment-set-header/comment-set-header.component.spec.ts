import { ComponentFixture, TestBed } from '@angular/core/testing';
import {CommentSetHeaderComponent} from './comment-set-header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../../store/reducers/reducers';
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import { CommentService } from '../comment/comment.service';

describe('CommentSetHeader', () => {
  let component: CommentSetHeaderComponent;
  let fixture: ComponentFixture<CommentSetHeaderComponent>;
  let nativeElement;
  let toolbarService: ToolbarEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})],
      declarations: [CommentSetHeaderComponent],
      providers: [
        CommentService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentSetHeaderComponent);
    nativeElement = fixture.debugElement.nativeElement;
    toolbarService = TestBed.inject(ToolbarEventService);
    component = fixture.componentInstance;
    component.showCommentSummary = true;
    component.tabSelected = 'comments';
    fixture.detectChanges();
  });

  it('should emit toggleCommentsSummary event', () => {
    const commentSummarySpy = spyOn(component.showCommentSummaryDialog, 'emit');
    const commentSummaryButton = nativeElement.querySelector('#commentSummary');

    commentSummaryButton.click();

    expect(commentSummarySpy).toHaveBeenCalled();
  });

  it('should set tabSelected', () => {
    component.tabSelected = 'comments';
    component.selectTab('tab1');
    expect(component.tabSelected).toEqual('tab1');
  });

  it('should reset tabSelected', () => {
    component.tabSelected = 'tab1';
    component.selectTab('tab1');
    expect(component.tabSelected).toBeUndefined();
  });

  it('should invert toggleCommentsPanel value', () => {
    const value = toolbarService.commentsPanelVisible.getValue();
    const toggleCommentsPanelSpy = spyOn(toolbarService, 'toggleCommentsPanel');
    component.toggleCommentsPanel();

    expect(toggleCommentsPanelSpy).toHaveBeenCalledWith(!value);
  });

  it('should set marginToComment to true if tab is selected', () => {
    component.tabSelected = 'comments';
    component.selectTab('tab1');
    expect(component.marginToComment).toBeTruthy();
  });

  it('should set marginToComment to false if tab is not selected', () => {
    component.tabSelected = 'tab1';
    component.selectTab('tab1');
    expect(component.marginToComment).toBeFalsy();
  });


});
