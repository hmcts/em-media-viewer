import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommentComponent } from './comment.component';
import { FormsModule } from '@angular/forms';

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;
  let nativeElement;
  const mockComment = {
    id: '16d5c513-15f9-4c39-8102-88bdb85d8831',
    annotationId: '4f3f9361-6d17-4689-81dd-5cb2e317b329',
    createdDate: '2018-05-28T08:48:33.206Z',
    createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
    createdByDetails: {
        'forename': 'Linus',
        'surname': 'Norton',
        'email': 'linus.norton@hmcts.net'
      },
    lastModifiedDate: '2019-05-28T08:48:33.206Z',
    lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
    lastModifiedByDetails: {
        'forename': 'Jeroen',
        'surname': 'Rijks',
        'email': 'jeroen.rijks@hmcts.net'
      },
    content: 'This is a comment.',
  };

  const mockRectangle = {
    x: 10, y: 10, width: 100, height: 20,
    id: '16d5c513-15f9-4c39-8102-88bdb85d8831',
    annotationId: '4f3f9361-6d17-4689-81dd-5cb2e317b329',
    createdDate: '2018-05-28T08:48:33.206Z',
    createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
    createdByDetails: {
      'forename': 'Linus',
      'surname': 'Norton',
      'email': 'linus.norton@hmcts.net'
    },
    lastModifiedDate: '2019-05-28T08:48:33.206Z',
    lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
    lastModifiedByDetails: {
      'forename': 'Jeroen',
      'surname': 'Rijks',
      'email': 'jeroen.rijks@hmcts.net'
    },
  }

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        CommentComponent,
      ],
      imports: [
        FormsModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    component.comment = {...mockComment};
    component.rectangle = {...mockRectangle};
    nativeElement = fixture.debugElement.nativeElement;
    nativeElement.style.position = 'absolute';
    nativeElement.style.width = '100px';
    nativeElement.style.height = '100px';
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set comment if date modified exists', () => {
    expect(component.lastUpdate).toEqual(mockComment.lastModifiedDate);
    expect(component.author).toEqual(mockComment.createdByDetails);
    expect(component.editor).toEqual(mockComment.lastModifiedByDetails);
    expect(component.fullComment).toEqual(mockComment.content);
  });

  it('should set comment with lastUpdate set to createdDate if there has been no update', () => {
    const modifiedMockComment = {...mockComment};
    modifiedMockComment.lastModifiedDate = null;
    modifiedMockComment.lastModifiedBy = null;
    modifiedMockComment.lastModifiedByDetails = null;
    component.comment = modifiedMockComment;
    fixture.detectChanges();
    expect(component.lastUpdate).toEqual(modifiedMockComment.createdDate);
    expect(component.author).toEqual(modifiedMockComment.createdByDetails);
    expect(component.editor).toEqual(modifiedMockComment.lastModifiedByDetails);
    expect(component.fullComment).toEqual(modifiedMockComment.content);
  });

  it('should emit a click', () => {
    const clickEmitEventSpy = spyOn(component.click, 'emit');
    component.onCommentClick();
    expect(clickEmitEventSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit a delete', () => {
    const deleteEmitEventSpy = spyOn(component.delete, 'emit');
    component.onDelete();
    expect(deleteEmitEventSpy).toHaveBeenCalledTimes(1);
  });

  it('should set comments to editable', () => {
    component.editable = false;
    component.onEdit();
    expect(component.editable).toBe(true);
  });

  it('should set comments to non-editable', () => {
    component.editable = true;
    component.onCancel();
    expect(component.editable).toBe(false);
  });

  it('should set commentStyle to uneditable', () => {
    component.editable = false;
    const commentStyleValue = component.commentStyle();
    expect(commentStyleValue).toContain('view-mode');
  });

  it('should set commentStyle to editable', () => {
    component.editable = true;
    const commentStyleValue = component.commentStyle();
    expect(commentStyleValue).toContain('edit-mode');
  });

  it('should set commentStyle to unselected', () => {
    component.selected = false;
    const commentStyleValue = component.commentStyle();
    expect(commentStyleValue).toContain('collapsed');
  });

  it('should set commentStyle to selected', () => {
    component.selected = true;
    const commentStyleValue = component.commentStyle();
    expect(commentStyleValue).toContain('expanded');
  });

  it('should get selected short comment', () => {
    component.selected = true;
    component.fullComment = 'short comment';
    const retrievedCommentText = component.commentText;
    expect(retrievedCommentText).toBe('short comment');
  });

  it('should get unselected short comment', () => {
    component.selected = false;
    component.fullComment = 'short comment';
    const retrievedCommentText = component.commentText;
    expect(retrievedCommentText).toBe('short comment');
  });

  it('should get unselected long comment', () => {
    component.selected = false;
    const longComment = 'This comment is longer than the maximum comment length, which is 50. Therefore, the comment should be shortened.';
    component.fullComment = longComment;
    const retrievedCommentText = component.commentText;
    expect(retrievedCommentText).toBe('This comment is longer than the maximum comment...');
  });

  it('should get selected long comment', () => {
    component.selected = true;
    const longComment = 'This comment is longer than the maximum comment length, which is 50. Therefore, the comment should be shortened.';
    component.fullComment = longComment;
    const retrievedCommentText = component.commentText;
    expect(retrievedCommentText).toBe(longComment);
  });

  it('rotate 0 should align to right and vertically with highlight', () => {
    component.rotate = 0;
    const style = component.formNgStyle();
    expect(style.left).toBe('100px');
    expect(style.top).toBe('10px');
  });

  it('rotate 90 should align to top and horizontally with highlight', () => {
    component.rotate = 90;
    const style = component.formNgStyle();
    expect(style.left).toBe('10px');
    expect(style.top).toBe('0px');
  });

  it('rotate 180 should align to left and horizontally with highlight (accounting for highlight dimensions)', () => {
    component.rotate = 180;
    const style = component.formNgStyle();
    expect(style.left).toBe('0px');
    expect(style.top).toBe('30px');
  });

  it('rotate 270 should align to bottom and horizontally with highlight (accounting for highlight dimensions)', () => {
    component.rotate = 270;
    const style = component.formNgStyle();
    expect(style.top).toBe('100px');
    expect(style.left).toBe('110px');
  });

});
