import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA, Renderer2} from '@angular/core';
import {ImageViewerComponent} from './image-viewer.component';
import {EmLoggerService} from '../../../logging/em-logger.service';
import {RotateOperation} from '../../media-viewer.model';

class MockRenderer {

}

describe('ImageViewerComponent', () => {
    let component: ImageViewerComponent;
    let fixture: ComponentFixture<ImageViewerComponent>;
    const mockRenderer = new MockRenderer();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageViewerComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        EmLoggerService,
        { provide: Renderer2, useFactory: () => mockRenderer },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageViewerComponent);
    component = fixture.componentInstance;

    component.url = 'http://localhost:3000';
    component.originalUrl = 'http://localhost:3000';

    const mockNativeElement = { querySelector() {} };
    spyOn(mockNativeElement, 'querySelector').and.callFake(function() {
      const dummyElement = document.createElement('div');
      return dummyElement;
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onRotateClockwise', () => {
    it('should add 90 degrees to rotation', () => {
      component.rotateOperation = new RotateOperation(90);
      expect(component['rotation']).toBe(90);
    });

  });
});

