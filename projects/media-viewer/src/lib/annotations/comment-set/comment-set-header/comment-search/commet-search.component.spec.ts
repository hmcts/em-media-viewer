import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarEventService } from '../../../../toolbar/toolbar.module';
import { CommentSearchComponent } from './comment-search.component';
import { FormsModule } from '@angular/forms';
import { AnnotationEventService } from '../../../annotation-event.service';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

describe('CommentSearch', () => {
  let hostComponent: TestHostComponent;
  let component: CommentSearchComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CommentSearchComponent, TestHostComponent],
      providers: [ToolbarEventService, AnnotationEventService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component = hostComponent.commentSearchComponent;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should focus element', () => {
    component.ngAfterViewInit();
  });

  it('should reset highlights', () => {
    component.ngOnDestroy();
  });

  it('should search comments', () => {
    component.searchComments('searchText');
  });

  it('should clear search', () => {
    component.clearSearch();
  });
});

@Component({
  selector: `host-component`,
  template: `<mv-comment-search [annotationSet]="annotationSet"></mv-comment-search>`
})
class TestHostComponent {
  annotationSet = { annotations: [] };

  @ViewChild(CommentSearchComponent) commentSearchComponent: CommentSearchComponent;
}
