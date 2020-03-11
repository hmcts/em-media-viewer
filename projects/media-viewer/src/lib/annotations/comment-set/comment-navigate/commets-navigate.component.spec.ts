import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';
import {CommentsNavigateComponent} from './comments-navigate.component';
import { FormsModule } from '@angular/forms';
import { AnnotationEventService } from '../../annotation-event.service';

describe('CommentSearch', () => {
  let component: CommentsNavigateComponent;
  let fixture: ComponentFixture<CommentsNavigateComponent>;
  let nativeElement;
  let toolbarEventService: ToolbarEventService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CommentsNavigateComponent],
      providers: [ToolbarEventService, AnnotationEventService]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsNavigateComponent);
    nativeElement = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;
    toolbarEventService = new ToolbarEventService();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
