import { ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommentComponent } from './comment.component';
import { FormsModule } from '@angular/forms';
import { CommentService } from './comment.service';

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
  };

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [
        CommentComponent
      ],
      imports: [
        FormsModule
      ],
      providers: [
        CommentService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

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
    component.comment = {...mockComment};

    expect(component.lastUpdate).toEqual(mockComment.lastModifiedDate);
    expect(component.author).toEqual(mockComment.createdByDetails);
    expect(component.editor).toEqual(mockComment.lastModifiedByDetails);
    expect(component.fullComment).toEqual(mockComment.content);
  });

  it('should get comment', () => {
    component.comment = {...mockComment};
    expect(component._comment).toEqual({...mockComment});
  });

  it('should set the unsavedChanges value', () => {
    inject([CommentService], (commentService: CommentService) => {
      spyOn(commentService, 'onCommentChange');
      component.onCommentChange('new comment');
      expect(commentService.onCommentChange).toHaveBeenCalledWith(true);
    });
  });

  it('should set the unsavedChanges value to true', () => {
    component.originalComment = 'old comment';
    component.onCommentChange('new comment');
    expect(component.hasUnsavedChanges).toBeTruthy();
  });

  it('should set the unsavedChanges value to false', () => {
    component.originalComment = 'old comment';
    component.onCommentChange('old comment');
    expect(component.hasUnsavedChanges).toBeFalsy();
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

  it('should emit changes event when comment editing cancelled', () => {
    const commentChangesEmitEventSpy = spyOn(component.changes, 'emit');
    component.onCancel();
    expect(commentChangesEmitEventSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit changes event when comment is saved', () => {
    const commentChangesEmitEventSpy = spyOn(component.changes, 'emit');
    component.onSave();
    expect(commentChangesEmitEventSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit a click', () => {
    const clickEmitEventSpy = spyOn(component.commentClick, 'emit');
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

  it('should set comments to non-editable', fakeAsync(() => {
    component.editable = true;
    component.selected = true;

    waitForChanges();
    component.onCancel();

    expect(component.editable).toBe(false);
  }));

  it('should set hasUnsavedChanges to false when changes cancelled', fakeAsync(() => {
    component.hasUnsavedChanges = true;

    waitForChanges();
    component.onCancel();

    expect(component.hasUnsavedChanges).toBe(false);
  }));

  it('should not set focus on textArea when comment made non-editable', fakeAsync(() => {
    component.editable = true;
    component.selected = true;
    component.fullComment = 'test comment';

    waitForChanges();
    component.onSave();

    expect(component.selected).toBe(true);
    expect(component.editable).toBe(false);
    expect(component.hasUnsavedChanges).toBe(false);
  }));

  it('should set commentStyle to uneditable', () => {
    component.editable = false;
    const commentStyleValue = component.commentStyle();
    expect(commentStyleValue).toContain('view-mode');
  });

  it('should set commentStyle to editable', fakeAsync(() => {
    component.editable = true;
    component.selected = true;

    waitForChanges();

    const commentStyleValue = component.commentStyle();
    expect(commentStyleValue).toContain('edit-mode');
  }));

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

    fixture.detectChanges();

    const expectedText = fixture.debugElement
      .query(element => element.name === 'textarea').attributes['ng-reflect-model'];

    expect(expectedText.trim()).toBe('short comment');
  });

  it('should get unselected short comment', () => {
    component.selected = false;
    component.fullComment = 'short comment';

    fixture.detectChanges();

    expect(nativeElement.querySelector('.unselectedText').textContent.trim()).toBe('short comment');
  });

  it('should emit a comment rendered', () => {
    const commentRenderedEmitEventSpy = spyOn(component.renderComments, 'emit');
    component.reRenderComments();
    expect(commentRenderedEmitEventSpy).toHaveBeenCalledTimes(1);
  });

  const waitForChanges = () => {
    fixture.detectChanges();
    tick(10);
    fixture.detectChanges();
  };
});
