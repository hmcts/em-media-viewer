import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subscription, BehaviorSubject, Subject } from 'rxjs';

import { ToolbarEventService } from '../../../../toolbar/toolbar-event.service';
import { HighlightCreateService } from '../highlight-create/highlight-create.service';
import { BoxHighlightCreateComponent } from './box-highlight-create.component';

describe('BoxHighlightCreateComponent', () => {
  let component: BoxHighlightCreateComponent;
  let fixture: ComponentFixture<BoxHighlightCreateComponent>;
  let nativeElement: HTMLElement;
  const mockHighlightService = { saveAnnotation: () => {}, applyRotation: () => {} };
  const drawModeSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  const redactWholePageSubject$ = new Subject<void>();
  const currentPageSubject$ = new Subject<number>();


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BoxHighlightCreateComponent],
      providers: [
        {
          provide: ToolbarEventService,
          useValue: {
            drawModeSubject: drawModeSubject$.asObservable(),
            redactWholePage: redactWholePageSubject$.asObservable(),
            setCurrentPageInputValueSubject: currentPageSubject$.asObservable()
          }
        },
        {
          provide: HighlightCreateService,
          useValue: mockHighlightService
        }
      ]
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

  describe('ngOnInit', () => {
    it('should set defaultWidth and defaultHeight to 0px',
      inject([ToolbarEventService], (toolbarEvents: ToolbarEventService) => {
        drawModeSubject$.next(false);
        component.ngOnInit();

        expect(component.defaultHeight).toBe('0px');
        expect(component.defaultWidth).toBe('0px');
      })
    );

    it('should set defaultWidth and defaultHeight to 100%',
      inject([ToolbarEventService], (toolbarEvents: ToolbarEventService) => {
        drawModeSubject$.next(true);
        component.ngOnInit();

        expect(component.defaultHeight).toBe('100%');
        expect(component.defaultWidth).toBe('100%');
      })
    );

    it('should set whole page',
      inject([ToolbarEventService], (toolbarEvents: ToolbarEventService) => {
        redactWholePageSubject$.next();
        component.ngOnInit();

        expect(component.wholePage).toBe(true);
      })
    );
  });


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

  describe('initHighlight', () => {
    it('should initialise the box highlight creator without ratation', () => {
      const mockTarget = document.createElement('div');
      spyOn(mockTarget, 'getBoundingClientRect').and.returnValue({
        top: 0,
        left: 0,
        right: 100,
        bottom: 100,
        width: 100,
        height: 100,
        x: 100,
        y: 100,

        toJSON: () => {}
      });
      const event = { clientX: 100, clientY: 200, target: mockTarget } as unknown as MouseEvent;

      component.initHighlight(event);

      expect(component.display).toBe('block');
      expect(component.backgroundColor).toEqual('yellow');
      expect(component.height).toBe(50);
      expect(component.width).toBe(50);
      expect(component.top).toBe(200);
      expect(component.left).toBe(100);
    });

    it('should initialise the box highlight creator with ratation on 90deg', () => {
      const mockTarget = document.createElement('div');
      const event = { clientX: 100, clientY: 200, target: mockTarget } as unknown as MouseEvent;
      spyOn(mockTarget, 'getBoundingClientRect').and.returnValue({
        top: 0,
        left: 0,
        right: 100,
        bottom: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        toJSON: () => {}
      });
      component.rotate = 90;
      fixture.detectChanges();

      component.initHighlight(event);

      expect(component.height).toBe(50);
      expect(component.width).toBe(50);
      expect(component.top).toBe(150);
      expect(component.left).toBe(100);
    });

    it('should initialise the box highlight creator with ratation on 180deg', () => {
      const mockTarget = document.createElement('div');
      const event = { clientX: 100, clientY: 200, target: mockTarget } as unknown as MouseEvent;
      spyOn(mockTarget, 'getBoundingClientRect').and.returnValue({
        top: 0,
        left: 0,
        right: 100,
        bottom: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        toJSON: () => {}
      });
      component.rotate = 180;
      fixture.detectChanges();

      component.initHighlight(event);

      expect(component.height).toBe(50);
      expect(component.width).toBe(50);
      expect(component.top).toBe(150);
      expect(component.left).toBe(50);
    });

    it('should initialise the box highlight creator with ratation on 270deg', () => {

      const mockTarget = document.createElement('div');
      const event = { clientX: 100, clientY: 200, target: mockTarget } as unknown as MouseEvent;
      spyOn(mockTarget, 'getBoundingClientRect').and.returnValue({
        top: 0,
        left: 0,
        right: 100,
        bottom: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        toJSON: () => {}
      });

      component.rotate = 270;
      fixture.detectChanges();

      component.initHighlight(event);

      expect(component.height).toBe(50);
      expect(component.width).toBe(50);
      expect(component.top).toBe(200);
      expect(component.left).toBe(50);
    });
  });

  describe('updateHighlight', () => {
    it('should update the box highlight creator', () => {
      const updateHighlightSpy = spyOn(component, 'updateHighlight').and.callThrough();
      const nativeElementDiv = fixture.debugElement.query(By.css('div')).nativeElement;
      spyOn(nativeElementDiv as any, 'getBoundingClientRect').and.returnValue({top: 0, left: 0});

      const updateEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
      component.drawStartX = 60;
      component.drawStartY = 50;
      fixture.detectChanges();

      nativeElementDiv.dispatchEvent(updateEvent);

      expect(updateHighlightSpy).toHaveBeenCalled();

      expect(component.width).toBe(40);
      expect(component.height).toBe(50);
      expect(component.top).toBe(50);
      expect(component.left).toBe(60);
    });

    it('should not update the box highlight when offsetX is 0', () => {
      const updateHighlightSpy = spyOn(component, 'updateHighlight').and.callThrough();
      const nativeElementDiv = fixture.debugElement.query(By.css('div')).nativeElement;
      spyOn(nativeElementDiv as any, 'getBoundingClientRect').and.returnValue({top: 0, left: 0});

      const updateEvent = new MouseEvent('mousemove', { clientX: 0, clientY: 100 });
      component.width = 100;
      component.height = 150;
      component.top = 50;
      component.left = 350;
      fixture.detectChanges();
      nativeElementDiv.dispatchEvent(updateEvent);

      expect(updateHighlightSpy).toHaveBeenCalled();

      expect(component.width).toBe(100);
      expect(component.height).toBe(150);
      expect(component.top).toBe(50);
      expect(component.left).toBe(350);
    });

    it('should not update the box highlight when offsetY is 0', () => {
      const updateHighlightSpy = spyOn(component, 'updateHighlight').and.callThrough();
      const nativeElementDiv = fixture.debugElement.query(By.css('div')).nativeElement;
      spyOn(nativeElementDiv as any, 'getBoundingClientRect').and.returnValue({top: 0, left: 0});

      const updateEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 0 });
      component.width = 100;
      component.height = 150;
      component.top = 50;
      component.left = 350;
      fixture.detectChanges();

      nativeElementDiv.dispatchEvent(updateEvent);

      expect(updateHighlightSpy).toHaveBeenCalled();

      expect(component.width).toBe(100);
      expect(component.height).toBe(150);
      expect(component.top).toBe(50);
      expect(component.left).toBe(350);
    });
  });

  describe('createHighlight', () => {
    it('should create the highlight when height is zoomed',
      inject([HighlightCreateService], (highlightService: HighlightCreateService) => {
        component.height = 20;
        component.zoom = 2;
        fixture.detectChanges();

        spyOn(component.saveSelection, 'emit');
        spyOn(highlightService, 'applyRotation');

        component.createHighlight();

        expect(component.saveSelection.emit).toHaveBeenCalled();
        expect(component.drawStartX).toBe(-1);
        expect(component.drawStartY).toBe(-1);
        expect(component.display).toBe('none');
        expect(component.width).toBe(0);
        expect(component.height).toBe(0);
      })
    );

    it('should create the highlight when width is zoomed',
      inject([HighlightCreateService], (highlightService: HighlightCreateService) => {
        component.width = 30;
        component.zoom = 4;
        fixture.detectChanges();

        spyOn(component.saveSelection, 'emit');
        spyOn(highlightService, 'applyRotation');

        component.createHighlight();

        expect(component.saveSelection.emit).toHaveBeenCalled();
        expect(component.drawStartX).toBe(-1);
        expect(component.drawStartY).toBe(-1);
        expect(component.display).toBe('none');
        expect(component.width).toBe(0);
        expect(component.height).toBe(0);
      })
    );

    it('should not create the highlight when height nor width is zoomed',
      inject([HighlightCreateService], (highlightService: HighlightCreateService) => {
        component.height = 20;
        component.width = 10;
        component.zoom = 5;
        fixture.detectChanges();

        spyOn(component.saveSelection, 'emit');
        spyOn(highlightService, 'applyRotation');

        component.createHighlight();

        expect(component.saveSelection.emit).not.toHaveBeenCalled();
        expect(component.drawStartX).toBe(-1);
        expect(component.drawStartY).toBe(-1);
        expect(component.display).toBeUndefined();
        expect(component.width).toBe(10);
        expect(component.height).toBe(20);
      })
    );

    it('should create whole page highlight',
    inject([HighlightCreateService], (highlightService: HighlightCreateService) => {
      const mockTarget = document.createElement('div');

      const event = { offsetX: 200, offsetY: 300, target: mockTarget } as unknown as MouseEvent;
      spyOn(mockTarget, 'getBoundingClientRect').and.returnValue({
        top: 0,
        left: 0,
        right: 100,
        bottom: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        toJSON: () => {}
      });
      component.wholePage = true;
      fixture.detectChanges();

        spyOn(component.saveSelection, 'emit');
        spyOn(highlightService, 'applyRotation');

        component.initHighlight(event);

        expect(highlightService.applyRotation).toHaveBeenCalledWith(400, 200, 400, 200, 0, 0, 0, 1);

        expect(component.saveSelection.emit).toHaveBeenCalled();
        expect(component.drawStartX).toBe(-1);
        expect(component.drawStartY).toBe(-1);
        expect(component.display).toBe('none');
        expect(component.width).toBe(0);
        expect(component.height).toBe(0);
        expect(component.wholePage).toBe(false);
    })
  );
  });

  describe('keyboard drawing', () => {
    it('should update cursor position state', () => {
      component.onCursorPositionChanged({ x: 12, y: 24, visible: true });

      expect(component.cursorX).toBe(12);
      expect(component.cursorY).toBe(24);
      expect(component.showCursor).toBeTrue();
    });

    it('should initialize keyboard drawing state on drawing started', () => {
      component.rotate = 180;
      const event = { startX: 100, startY: 200, width: 50, height: 20 };

      component.onDrawingStarted(event);

      expect(component.keyboardDrawingMode).toBeTrue();
      expect(component.display).toBe('block');
      expect(component.backgroundColor).toBe('yellow');
      expect(component.width).toBe(50);
      expect(component.height).toBe(20);
      expect(component.top).toBe(180);
      expect(component.left).toBe(50);
    });

    it('should update dimensions on drawing updated', () => {
      component.onDrawingUpdated({ startX: 0, startY: 0, width: 25, height: 30 });

      expect(component.width).toBe(25);
      expect(component.height).toBe(30);
    });

    it('should confirm drawing and create highlight', () => {
      const createSpy = spyOn(component, 'createHighlight');
      component.keyboardDrawingMode = true;

      component.onDrawingConfirmed({ startX: 0, startY: 0, width: 15, height: 15 });

      expect(component.keyboardDrawingMode).toBeFalse();
      expect(createSpy).toHaveBeenCalled();
    });

    it('should cancel drawing and reset highlight state', () => {
      const drawModeSubject = { next: jasmine.createSpy('next') };
      (component as any).toolbarEvents = { drawModeSubject };
      component.keyboardDrawingMode = true;
      component.width = 20;
      component.height = 20;
      component.display = 'block';

      component.onDrawingCancelled();

      expect(component.keyboardDrawingMode).toBeFalse();
      expect(component.display).toBe('none');
      expect(component.width).toBe(0);
      expect(component.height).toBe(0);
      expect(drawModeSubject.next).toHaveBeenCalledWith(false);
    });
  });
});
