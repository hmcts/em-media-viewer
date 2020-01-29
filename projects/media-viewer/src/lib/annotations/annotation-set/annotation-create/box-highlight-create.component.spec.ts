import { BoxHighlightCreateComponent } from './box-highlight-create.component';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { BoxHighlightCreateService } from './box-highlight-create.service';
import { Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { AnnotationApiService } from '../../annotation-api.service';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AnnotationEventService } from '../../annotation-event.service';

describe('BoxHighlightCreateComponent', () => {
  let component: BoxHighlightCreateComponent;
  let fixture: ComponentFixture<BoxHighlightCreateComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BoxHighlightCreateComponent],
      providers: [BoxHighlightCreateService, AnnotationApiService, ToolbarEventService, AnnotationEventService]
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

  it('should initialise, then destroy subscriptions',
    inject([BoxHighlightCreateService], (highlightCreateService) => {
      const mockSubscription = new Subject();
      spyOn(highlightCreateService.initHighlight, 'subscribe').and.returnValue(mockSubscription);
      spyOn(highlightCreateService.updateHighlight, 'subscribe').and.returnValue(mockSubscription);
      spyOn(highlightCreateService.createHighlight, 'subscribe').and.returnValue(mockSubscription);
      spyOn(mockSubscription, 'unsubscribe');

      component.ngOnInit();

      expect(highlightCreateService.initHighlight.subscribe).toHaveBeenCalled();
      expect(highlightCreateService.updateHighlight.subscribe).toHaveBeenCalled();
      expect(highlightCreateService.createHighlight.subscribe).toHaveBeenCalled();

      component.ngOnDestroy();

      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    })
  );

  it('should initialise the box highlight creator', () => {
    const event = { pageX: 100, pageY: 200 } as MouseEvent;

    component.init(event);

    expect(component.display).toBe('block');
    expect(component.height).toBe('50px');
    expect(component.width).toBe('50px');
    expect(component.top).toBe('100px');
    expect(component.left).toBe('-100px');
  });

  it('should update the box highlight creator, with no rotation', () => {
    const updateEvent = { pageX: 100, pageY: 100 } as MouseEvent;
    component.drawStartX = 60;
    component.drawStartY = 50;

    component.update(updateEvent);

    expect(component.width).toBe('160px');
    expect(component.height).toBe('50px');
    expect(component.top).toBe('0px');
    expect(component.left).toBe('-100px');
  });

  it('should update the box highlight creator, when rotate is 90', () => {
    const updateEvent = { pageX: 100, pageY: 100 } as MouseEvent;
    component.drawStartX = 60;
    component.drawStartY = 50;
    component.rotate = 90;

    component.update(updateEvent);

    expect(component.width).toBe('50px');
    expect(component.height).toBe('160px');
    expect(component.top).toBe('340px');
    expect(component.left).toBe('0px');
  });

  it('should update the box highlight creator, when rotate is 180', () => {
    const updateEvent = { pageX: 100, pageY: 100 } as MouseEvent;
    component.drawStartX = 60;
    component.drawStartY = 50;
    component.rotate = 180;

    component.update(updateEvent);

    expect(component.width).toBe('50px');
    expect(component.height).toBe('160px');
    expect(component.top).toBe('350px');
    expect(component.left).toBe('140px');
  });

  it('should update the box highlight creator, when rotate is 270', () => {
    const updateEvent = { pageX: 100, pageY: 100 } as MouseEvent;
    component.drawStartX = 60;
    component.drawStartY = 50;
    component.rotate = 270;

    component.update(updateEvent);

    expect(component.width).toBe('50px');
    expect(component.height).toBe('160px');
    expect(component.top).toBe('-100px');
    expect(component.left).toBe('150px');
  });

  it('should create the highlight', () => {
    spyOn(component.highlightCreated, 'emit');
    component.drawStartX = 60;
    component.drawStartY = 50;
    component.display = 'block';
    component.height = '50px';
    component.width = '50px';
    component.top = '50px';
    component.left = '50px';

    component.create();

    expect(component.highlightCreated.emit).toHaveBeenCalled();
    expect(component.drawStartX).toBe(-1);
    expect(component.drawStartY).toBe(-1);
    expect(component.display).toBe('none');
    expect(component.width).toBe('0px');
    expect(component.height).toBe('0px');
  });
});
