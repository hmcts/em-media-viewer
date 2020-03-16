import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';
import { CommentsNavigateComponent } from './comments-navigate.component';
import { FormsModule } from '@angular/forms';
import { AnnotationEventService } from '../../annotation-event.service';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

describe('CommentsNavigateComponent', () => {
  let hostComponent: TestHostComponent;
  let component: CommentsNavigateComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CommentsNavigateComponent, TestHostComponent],
      providers: [ToolbarEventService, AnnotationEventService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component = hostComponent.commentsNavigateComponent;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should init nagivation list', () => {
    component.ngOnChanges({});
  });

  it('should navigate to next item', () => {
    component.nextItem();
  });

  it('should navigate to previous item', () => {
    component.prevItem();
  });
});

@Component({
  selector: `host-component`,
  template: `<mv-comments-navigate [annotationList]="annotationList"></mv-comments-navigate>`
})
class TestHostComponent {
  annotationList = [];

  @ViewChild(CommentsNavigateComponent) commentsNavigateComponent;
}
