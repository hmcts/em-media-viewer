import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentsNavigateComponent } from './comments-navigate.component';
import { FormsModule } from '@angular/forms';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../../store/reducers';

describe('CommentsNavigateComponent', () => {
  let hostComponent: TestHostComponent;
  let component: CommentsNavigateComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, StoreModule.forFeature('media-viewer', reducers), StoreModule.forRoot({}),],
      declarations: [CommentsNavigateComponent, TestHostComponent],
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
    component.index = 0;
    component.navigationList = [{page: 1}, {page: 2}];
    component.nextItem();
  });

  it('should navigate to previous item', () => {
    component.index = 1;
    component.navigationList = [{page: 1}];
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
