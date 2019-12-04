import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { CommentSetToggleComponent } from './comment-set-toggle.component';
import { ViewerEventService } from '../../../viewers/viewer-event.service';

describe('CommentSetToggleComponent', () => {
  let component: CommentSetToggleComponent;
  let fixture: ComponentFixture<CommentSetToggleComponent>;
  let viewerEvent: ViewerEventService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CommentSetToggleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentSetToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should toggle comments panel',
    inject([ViewerEventService], (viewerEvents: ViewerEventService) => {
      spyOn(viewerEvents, 'toggleCommentsPanel');

      component.toggleCommentsPanel();

      expect(viewerEvents.toggleCommentsPanel).toHaveBeenCalledWith(true);
    }));
});
