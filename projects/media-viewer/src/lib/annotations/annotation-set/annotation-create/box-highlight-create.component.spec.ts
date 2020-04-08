import { BoxHighlightCreateComponent } from './box-highlight-create.component';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { AnnotationApiService } from '../../annotation-api.service';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../../store/reducers';
import { HighlightCreateService } from './highlight-create.service';

describe('BoxHighlightCreateComponent', () => {
  let component: BoxHighlightCreateComponent;
  let fixture: ComponentFixture<BoxHighlightCreateComponent>;
  let nativeElement: HTMLElement;
  const mockHighlightService = {};

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
});
