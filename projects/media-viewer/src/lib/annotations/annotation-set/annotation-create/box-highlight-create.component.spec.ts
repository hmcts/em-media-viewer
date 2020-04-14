import { BoxHighlightCreateComponent } from './box-highlight-create.component';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AnnotationApiService } from '../../annotation-api.service';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HighlightCreateService } from './highlight-create.service';

describe('BoxHighlightCreateComponent', () => {
  let component: BoxHighlightCreateComponent;
  let fixture: ComponentFixture<BoxHighlightCreateComponent>;
  let nativeElement: HTMLElement;
  const mockHighlightService = {
    saveAnnotation: () => {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BoxHighlightCreateComponent],
      providers: [
        AnnotationApiService,
        ToolbarEventService,
        { provide: HighlightCreateService, useValue: mockHighlightService }]
    }).compileComponents();

    fixture = TestBed.createComponent(BoxHighlightCreateComponent);
    nativeElement = fixture.debugElement.query(By.css('div.box-highlight')).nativeElement;
    component = fixture.componentInstance;
    component.rotate = 0;
    component.zoom = 1;
    component.pageHeight = 400;
    component.pageWidth = 200;
    component.container = { top: 100, left: 200 };
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to the drawMode subject',
    inject([ToolbarEventService], (toolbarEvents) => {
      const mockSubscription = { unsubscribe: () => {} };
      spyOn(toolbarEvents.drawModeSubject, 'subscribe').and.returnValue(mockSubscription);

      component.ngOnInit();

      expect(toolbarEvents.drawModeSubject.subscribe).toHaveBeenCalled();
    })
  );

  it('should destroy subscriptions',
    inject([ToolbarEventService], (toolbarEvents) => {
      const mockSubscription = { unsubscribe: () => {} };
      spyOn(toolbarEvents.drawModeSubject, 'subscribe').and.returnValue(mockSubscription);
      spyOn(mockSubscription, 'unsubscribe');

      component.ngOnInit();
      component.ngOnDestroy();

      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    })
  );

  it('should initialise the box highlight creator', () => {
    const event = { offsetX: 100, offsetY: 200 } as MouseEvent;

    component.initHighlight(event);

    expect(component.display).toBe('block');
    expect(component.height).toBe(50);
    expect(component.width).toBe(50);
    expect(component.top).toBe(200);
    expect(component.left).toBe(100);
  });

  it('should update the box highlight creator, with no rotation', () => {
    const updateEvent = { offsetX: 100, offsetY: 100 } as MouseEvent;
    component.drawStartX = 60;
    component.drawStartY = 50;

    component.updateHighlight(updateEvent);

    expect(component.width).toBe(40);
    expect(component.height).toBe(50);
    expect(component.top).toBe(50);
    expect(component.left).toBe(60);
  });

  it('should update the box highlight creator, when rotate is 90', () => {
    const updateEvent = { offsetX: 100, offsetY: 100 } as MouseEvent;
    component.drawStartX = 60;
    component.drawStartY = 50;
    component.rotate = 90;

    component.updateHighlight(updateEvent);

    expect(component.width).toBe(40);
    expect(component.height).toBe(50);
    expect(component.top).toBe(50);
    expect(component.left).toBe(60);
  });

  it('should update the box highlight creator, when rotate is 180', () => {
    const updateEvent = { offsetX: 100, offsetY: 100 } as MouseEvent;
    component.drawStartX = 60;
    component.drawStartY = 50;
    component.rotate = 180;

    component.updateHighlight(updateEvent);

    expect(component.width).toBe(40);
    expect(component.height).toBe(50);
    expect(component.top).toBe(50);
    expect(component.left).toBe(60);
  });

  it('should update the box highlight creator, when rotate is 270', () => {
    const updateEvent = { offsetX: 100, offsetY: 100 } as MouseEvent;
    component.drawStartX = 60;
    component.drawStartY = 50;
    component.rotate = 270;

    component.updateHighlight(updateEvent);
    expect(component.width).toBe(40);
    expect(component.height).toBe(50);
    expect(component.top).toBe(50);
    expect(component.left).toBe(60);
  });

  it('should create the highlight',
    inject([HighlightCreateService, ToolbarEventService], (highlightService, toolbarEvents) => {
      component.height = 10;
      spyOn(highlightService, 'saveAnnotation');
      spyOn(toolbarEvents.drawModeSubject, 'next');

      component.createHighlight();

      expect(highlightService.saveAnnotation).toHaveBeenCalled();
      expect(toolbarEvents.drawModeSubject.next).toHaveBeenCalledWith(false);
      expect(component.drawStartX).toBe(-1);
      expect(component.drawStartY).toBe(-1);
      expect(component.display).toBe('none');
      expect(component.width).toBe(0);
      expect(component.height).toBe(0);
    })
  );
});
