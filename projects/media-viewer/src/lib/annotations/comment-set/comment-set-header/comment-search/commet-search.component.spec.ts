import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarEventService } from '../../../../toolbar/toolbar.module';
import {CommentSearchComponent} from './comment-search.component';
import { FormsModule } from '@angular/forms';
import { AnnotationEventService } from '../../../annotation-event.service';

describe('CommentSearch', () => {
  let component: CommentSearchComponent;
  let fixture: ComponentFixture<CommentSearchComponent>;
  let nativeElement;
  let toolbarEventService: ToolbarEventService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CommentSearchComponent],
      providers: [ToolbarEventService, AnnotationEventService]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentSearchComponent);
    nativeElement = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;
    toolbarEventService = new ToolbarEventService();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
