import { DragDirective } from './drag.directive';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

describe('DragScrollDirective', () => {
  let component: ImageViewerComponent;
  let fixture: ComponentFixture<ImageViewerComponent>;
  let imageElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DragDirective, ImageViewerComponent],
      imports: [HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(ImageViewerComponent);
    component = fixture.componentInstance;
    component.rotation = 0;
    component.enableDragScroll = true;
    fixture.detectChanges();
    imageElement = fixture.debugElement.query(By.css('img'));
  });

  it('should create an instance', () => {
    const directive = new DragDirective(imageElement);
    expect(directive).toBeTruthy();
  });
});
