import { BoxHighlightCreateComponent } from './box-highlight-create.component';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { AnnotationApiService } from '../../annotation-api.service';
import { ToolbarEventService } from '../../../toolbar/toolbar.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../../store/reducers';

xdescribe('BoxHighlightCreateComponent', () => {
  let component: BoxHighlightCreateComponent;
  let fixture: ComponentFixture<BoxHighlightCreateComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModule.forFeature('media-viewer', reducers), StoreModule.forRoot({}),],
      declarations: [BoxHighlightCreateComponent],
      providers: [AnnotationApiService, ToolbarEventService]
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
    const event = { pageX: 100, pageY: 200 } as MouseEvent;

    component.initHighlight(event);

    expect(component.display).toBe('block');
    expect(component.height).toBe(50);
    expect(component.width).toBe(50);
    expect(component.top).toBe(100);
    expect(component.left).toBe(-100);
  });

  it('should update the box highlight creator, with no rotation', () => {
    const updateEvent = { pageX: 100, pageY: 100 } as MouseEvent;
    component.drawStartX = 60;
    component.drawStartY = 50;

    component.updateHighlight(updateEvent);

    expect(component.width).toBe(160);
    expect(component.height).toBe(50);
    expect(component.top).toBe(0);
    expect(component.left).toBe(-100);
  });

  it('should update the box highlight creator, when rotate is 90', () => {
    const updateEvent = { pageX: 100, pageY: 100 } as MouseEvent;
    component.drawStartX = 60;
    component.drawStartY = 50;
    component.rotate = 90;

    component.updateHighlight(updateEvent);

    expect(component.width).toBe(50);
    expect(component.height).toBe(160);
    expect(component.top).toBe(340);
    expect(component.left).toBe(0);
  });

  it('should update the box highlight creator, when rotate is 180', () => {
    const updateEvent = { pageX: 100, pageY: 100 } as MouseEvent;
    component.drawStartX = 60;
    component.drawStartY = 50;
    component.rotate = 180;

    component.updateHighlight(updateEvent);

    expect(component.width).toBe(160);
    expect(component.height).toBe(50);
    expect(component.top).toBe(350);
    expect(component.left).toBe(140);
  });

  it('should update the box highlight creator, when rotate is 270', () => {
    const updateEvent = { pageX: 100, pageY: 100 } as MouseEvent;
    component.drawStartX = 60;
    component.drawStartY = 50;
    component.rotate = 270;

    component.updateHighlight(updateEvent);
    expect(component.width).toBe(50);
    expect(component.height).toBe(160);
    expect(component.top).toBe(-100);
    expect(component.left).toBe(150);
  });
});
