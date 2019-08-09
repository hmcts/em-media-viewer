import { AnnotationComponent } from './annotation.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentComponent } from '../../comment-set/comment/comment.component';
import { RectangleComponent } from './rectangle/rectangle.component';
import { FormsModule } from '@angular/forms';
import { annotationSet } from '../../../../assets/annotation-set';
import { PopupToolbarComponent } from './popup-toolbar/popup-toolbar.component';
import { Annotation } from './annotation.model';

describe('AnnotationComponent', () => {
  let component: AnnotationComponent;
  let fixture: ComponentFixture<AnnotationComponent>;

  const annotation: Annotation = {
    createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
    createdByDetails: {
      forename: 'em-showcase',
      surname: 'testuser',
      email: 'emshowcase@hmcts.net'
    },
    lastModifiedByDetails: {
      forename: 'em-showcase',
      surname: 'testuser',
      email: 'emshowcase@hmcts.net'
    },
    createdDate: '2019-05-28T08:48:19.681Z',
    lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
    lastModifiedDate: '2019-05-28T08:48:33.206Z',
    id: '123',
    page: 1,
    color: 'FFFF00',
    annotationSetId: '8f7aa07c-2343-44e3-b3db-bf689066d00e',
    comments: [],
    rectangles: [],
    type: 'highlight'
  };

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        AnnotationComponent,
        CommentComponent,
        RectangleComponent,
        PopupToolbarComponent
      ],
      imports: [
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationComponent);
    component = fixture.componentInstance;
    component.annotation = annotation;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('select the annotation', async () => {
      component.onSelect();

      expect(component.selected).toBe(true);
  });

  it('deselect the annotation', async () => {
      const relatedTarget = document.createElement('span');
      component.onFocusOut({ relatedTarget } as any);

      expect(component.selected).toBe(false);
  });

  it('create a comment', async () => {
    component.annotation = annotation;

    component.addOrEditComment();

    expect(component.annotation.comments.length).toBeGreaterThan(0);
    expect(component.annotation.comments[0].annotationId).toEqual(component.annotation.id);
    expect(component.annotation.comments[0].content).toBe('');
    expect(component.annotation.comments[0].createdByDetails).toBe(undefined);
  });

  it('create a comment', async () => {
    component.addOrEditComment();

    expect(component.annotation.comments[0].content).toBe('');
    expect(component.annotation.comments[0].createdByDetails).toBe(undefined);
  });

  it('delete the annotation', async () => {
    spyOn(component.delete, 'emit');

    const rectangles = { ...component.annotation.rectangles };

    component.deleteHighlight();

    expect(rectangles).not.toEqual(component.annotation.rectangles);
    expect(component.delete.emit).toHaveBeenCalledWith(component.annotation);
  });
});
