import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { CommentsNavigateComponent } from './comments-navigate.component';
import { FormsModule } from '@angular/forms';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import {reducers} from '../../../store/reducers';
import {RouterTestingModule} from '@angular/router/testing';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';

describe('CommentsNavigateComponent', () => {
  let hostComponent: TestHostComponent;
  let component: CommentsNavigateComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  const annotationList = [
    { annotationId: 'annoId1', comments: [{ content: 'comment 1' }], page: 1, rectangles: [{ y: 20, x: 30 }, { y: 10, x: 30 }] },
    { annotationId: 'annoId2', comments: [{ content: 'comment 2' }], page: 1, rectangles: [{ y: 20, x: 40 }] },
    { annotationId: 'annoId2', comments: [{ content: 'comment 3' }], page: 1, rectangles: [{ y: 30, x: 40 }] },
    { annotationId: 'annoId2', comments: [{ content: 'comment 4' }], page: 2, rectangles: [{ y: 10, x: 40 }] }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({}),
        RouterTestingModule
      ],
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

  it('should init nagivation list',
    inject([Store, ToolbarEventService], (store, toolbarEvents) => {
      spyOn(store, 'dispatch');
      spyOn(toolbarEvents, 'setPage');
      component.autoSelect = true;
      hostComponent.annotationList = annotationList;
      fixture.detectChanges();

      expect(component.navigationList).toBeTruthy();
      expect(component.navigationList[0].rectangle.y).toBe(10);
      expect(component.navigationList[3].rectangle.y).toBe(10);
      expect(toolbarEvents.setPage).toHaveBeenCalledWith(1);
      expect(store.dispatch).toHaveBeenCalled();
  }));

  it('should navigate to next item',
    inject([Store], (store) => {
      spyOn(store, 'dispatch');
      component.index = 0;
      component.navigationList = [{ page: 1, annotationId: 'annoId1' }, { page: 2, annotationId: 'annoId2'}];
      component.nextItem();

      expect(component.index).toBe(1);
      expect(store.dispatch).toHaveBeenCalled();
  }));

  it('should navigate to previous item',
    inject([Store], (store) => {
      spyOn(store, 'dispatch');
      component.index = 1;
      component.navigationList = [{ page: 1, annotationId: 'annoId1' }, { page: 2, annotationId: 'annoId2'}];
      component.prevItem();

      expect(component.index).toBe(0);
      expect(store.dispatch).toHaveBeenCalled();
  }));
});

@Component({
  selector: `host-component`,
  template: `<mv-comments-navigate [annotationList]="annotationList"></mv-comments-navigate>`
})
class TestHostComponent {
  annotationList = [];

  @ViewChild(CommentsNavigateComponent) commentsNavigateComponent;
}
