/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HighlightToolbarComponent } from './highlight-toolbar.component';
import { FormsModule } from '@angular/forms';
import { RpxTranslationModule } from 'rpx-xui-translation';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers/reducers';
import { ToolbarEventService } from '../toolbar-event.service';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';
import { ToolbarFocusService } from '../toolbar-focus.service';

describe('HighlightToolbarComponent', () => {
  let component: HighlightToolbarComponent;
  let fixture: ComponentFixture<HighlightToolbarComponent>;
  let nativeElement;
  let toolbarService: ToolbarEventService;
  let toolbarFocusService: ToolbarFocusService

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [
        HighlightToolbarComponent,
      ],
      imports: [
        FormsModule,
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({}),
        RpxTranslationModule.forRoot({
          baseUrl: '',
          debounceTimeMs: 300,
          validity: {
            days: 1
          },
          testMode: true
        })
      ],
      providers: [ToolbarButtonVisibilityService, ToolbarEventService, ToolbarFocusService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightToolbarComponent);
    component = fixture.componentInstance;
    toolbarService = TestBed.inject(ToolbarEventService);
    toolbarFocusService = TestBed.inject(ToolbarFocusService);
    nativeElement = fixture.debugElement.nativeElement;
    component.toolbarButtons.showHighlightButton = true;
    component.toolbarButtons.showDrawButton = true;
    component.toolbarButtons.showRotate = true;
    component.toolbarButtons.showZoom = true;
    component.toolbarButtons.showPrint = true;
    component.toolbarButtons.showDownload = true;
    component.toolbarButtons.showCommentSummary = true;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with both annotation modes deactivated', () => {
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).not.toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).not.toHaveClass('toggled');
  });

  it('should toggle on the highlight button', () => {
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).not.toHaveClass('toggled');
    component.onHighlight();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).toHaveClass('toggled');
  });

  it('should toggle off the highlight button', () => {
    component.onHighlight();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).toHaveClass('toggled');
    component.onHighlight();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).not.toHaveClass('toggled');
  });

  it('should show the draw button if permitted', () => {
    component.toolbarButtons.showHighlightButton = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).toBeTruthy();
  });

  it('should toggle on the draw button', () => {
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).not.toHaveClass('toggled');
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).toHaveClass('toggled');
  });

  it('should  toggle off the draw button', () => {
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).toHaveClass('toggled');
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).not.toHaveClass('toggled');
  });

  it('should turn draw mode off when highlight is selected', () => {
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).not.toHaveClass('toggled');
    component.onHighlight();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).not.toHaveClass('toggled');
  });

  it('should turn highlight mode off when draw is selected', () => {
    component.onHighlight();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).not.toHaveClass('toggled');
    component.onClickDrawToggle();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--draw')).nativeElement).toHaveClass('toggled');
    expect(fixture.debugElement.query(By.css('.mv-toolbar__menu-button--highlight')).nativeElement).not.toHaveClass('toggled');
  });

  describe('keyboard navigation', () => {
    describe('onEscapeKey', () => {
      it('should close toolbar and return focus to main toolbar on Escape key', () => {
        const mockEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        const preventDefaultSpy = spyOn(mockEvent, 'preventDefault');
        const stopPropagationSpy = spyOn(mockEvent, 'stopPropagation');
        const closeSpy = spyOn(component, 'onClose');
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');

        component.onEscapeKey(mockEvent);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalledWith('#mvHighlightBtn');
      });
    });

    describe('onArrowUp', () => {
      it('should return focus to main toolbar when ArrowUp pressed inside highlight toolbar', () => {
        const button = document.createElement('button');
        button.className = 'test-button';
        const toolbar = document.createElement('div');
        toolbar.className = 'redaction';
        toolbar.appendChild(button);
        document.body.appendChild(toolbar);

        const mockEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        Object.defineProperty(mockEvent, 'target', { value: button, enumerable: true });
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');

        component.onArrowUp(mockEvent);

        expect(focusSpy).toHaveBeenCalledWith('#mvHighlightBtn');
        document.body.removeChild(toolbar);
      });

      it('should not return focus when target is not inside highlight toolbar', () => {
        const button = document.createElement('button');
        button.className = 'test-button';
        document.body.appendChild(button);

        const mockEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        Object.defineProperty(mockEvent, 'target', { value: button, enumerable: true });
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');

        component.onArrowUp(mockEvent);

        expect(focusSpy).not.toHaveBeenCalled();
        document.body.removeChild(button);
      });
    });
  });
});
