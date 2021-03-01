import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subscription, BehaviorSubject } from 'rxjs';

import { ToolbarEventService } from '../../../../toolbar/toolbar.module';
import { HighlightCreateService } from '../highlight-create/highlight-create.service';
import { BoxHighlightCreateComponent } from './box-highlight-create.component';

describe('BoxHighlightCreateComponent', () => {
  let component: BoxHighlightCreateComponent;
  let fixture: ComponentFixture<BoxHighlightCreateComponent>;
  let nativeElement: HTMLElement;
  const mockHighlightService = { saveAnnotation: () => {}, applyRotation: () => {} };
  const drawModeSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BoxHighlightCreateComponent],
      providers: [
        {
          provide: ToolbarEventService,
          useValue: {
            drawModeSubject: drawModeSubject$.asObservable()
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
      const event = { offsetX: 100, offsetY: 200 } as MouseEvent;

      component.initHighlight(event);

      expect(component.display).toBe('block');
      expect(component.backgroundColor).toEqual('yellow');
      expect(component.height).toBe(50);
      expect(component.width).toBe(50);
      expect(component.top).toBe(200);
      expect(component.left).toBe(100);
    });

    it('should initialise the box highlight creator with ratation on 90deg', () => {
      const event = { offsetX: 100, offsetY: 200 } as MouseEvent;
      component.rotate = 90;
      fixture.detectChanges();

      component.initHighlight(event);

      expect(component.height).toBe(50);
      expect(component.width).toBe(50);
      expect(component.top).toBe(150);
      expect(component.left).toBe(100);
    });

    it('should initialise the box highlight creator with ratation on 180deg', () => {
      const event = { offsetX: 100, offsetY: 200 } as MouseEvent;
      component.rotate = 180;
      fixture.detectChanges();

      component.initHighlight(event);

      expect(component.height).toBe(50);
      expect(component.width).toBe(50);
      expect(component.top).toBe(150);
      expect(component.left).toBe(50);
    });

    it('should initialise the box highlight creator with ratation on 270deg', () => {
      const event = { offsetX: 100, offsetY: 200 } as MouseEvent;
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
      const updateEvent = { offsetX: 100, offsetY: 100 } as MouseEvent;
      component.drawStartX = 60;
      component.drawStartY = 50;
      fixture.detectChanges();

      component.updateHighlight(updateEvent);

      expect(component.width).toBe(40);
      expect(component.height).toBe(50);
      expect(component.top).toBe(50);
      expect(component.left).toBe(60);
    });

    it('should not update the box highlight when offsetX is 0', () => {
      const updateEvent = { offsetX: 0, offsetY: 100 } as MouseEvent;
      component.width = 100;
      component.height = 150;
      component.top = 50;
      component.left = 350;
      fixture.detectChanges();

      component.updateHighlight(updateEvent);

      expect(component.width).toBe(100);
      expect(component.height).toBe(150);
      expect(component.top).toBe(50);
      expect(component.left).toBe(350);
    });

    it('should not update the box highlight when offsetY is 0', () => {
      const updateEvent = { offsetX: 100, offsetY: 0 } as MouseEvent;
      component.width = 100;
      component.height = 150;
      component.top = 50;
      component.left = 350;
      fixture.detectChanges();

      component.updateHighlight(updateEvent);

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
  });
});
