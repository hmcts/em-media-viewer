import { RpxTranslationModule } from 'rpx-xui-translation';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers/reducers';
import { RedactionToolbarComponent } from './redaction-toolbar.component';
import { SearchType, ToolbarEventService } from '../toolbar-event.service';
import { ToolbarFocusService } from '../toolbar-focus.service';
import { RedactionSearch } from '../redaction-search-bar/redaction-search.model';
import { Subject } from 'rxjs';

describe('RedactionToolbarComponent', () => {
  let component: RedactionToolbarComponent;
  let fixture: ComponentFixture<RedactionToolbarComponent>;
  let toolbarEvents: ToolbarEventService;
  let toolbarFocusService: ToolbarFocusService
  const redactAllInProgressSubject: Subject<RedactionSearch> = new Subject<RedactionSearch>();

  const toolbarEventsMock = {
    openRedactionSearch: { next: () => { } },
    highlightModeSubject: { next: () => { } },
    drawModeSubject: { next: () => { } },
    toggleRedactionPreview: () => { },
    unmarkAll: () => { },
    applyRedactionToDocument: () => { },
    redactPage: () => { },
    toggleRedactionMode: () => { },
    redactAllInProgressSubject: redactAllInProgressSubject.asObservable()
  };

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [RedactionToolbarComponent],
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
      providers: [{ provide: ToolbarEventService, useValue: toolbarEventsMock }, ToolbarFocusService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedactionToolbarComponent);
    component = fixture.componentInstance;
    toolbarEvents = TestBed.inject(ToolbarEventService);
    toolbarFocusService = TestBed.inject(ToolbarFocusService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should enableSearchRedactionMode', () => {
    spyOn(toolbarEvents.openRedactionSearch, 'next');

    component.onRedactAllSearch();

    expect(toolbarEvents.openRedactionSearch.next).toHaveBeenCalledOnceWith({ modeType: SearchType.Redact, isOpen: true});
  });

  it('should toggleTextRedactionMode', () => {
    spyOn(toolbarEvents.highlightModeSubject, 'next');

    component.toggleTextRedactionMode();

    expect(toolbarEvents.highlightModeSubject.next).toHaveBeenCalled();
  });

  it('should toggleDrawMode', () => {
    spyOn(toolbarEvents.drawModeSubject, 'next');

    component.toggleDrawMode();

    expect(toolbarEvents.drawModeSubject.next).toHaveBeenCalled();
  });

  it('should togglePreview', () => {
    spyOn(toolbarEvents, 'toggleRedactionPreview');

    component.togglePreview();

    expect(toolbarEvents.toggleRedactionPreview).toHaveBeenCalled();
  });

  it('should unmarkAll', () => {
    spyOn(toolbarEvents, 'unmarkAll');

    component.unmarkAll();

    expect(toolbarEvents.unmarkAll).toHaveBeenCalled();
  });

  it('should redact', () => {
    spyOn(toolbarEvents, 'applyRedactionToDocument');

    component.redact();

    expect(toolbarEvents.applyRedactionToDocument).toHaveBeenCalled();
  });

  it('should redact page', () => {
    spyOn(toolbarEvents, 'redactPage');
    spyOn(toolbarEvents.drawModeSubject, 'next');

    component.redactPage();

    expect(toolbarEvents.redactPage).toHaveBeenCalled();
    expect(toolbarEvents.drawModeSubject.next).toHaveBeenCalled();
  });

  it('should call toggleRedactionMode', () => {
    const toggleRedactionModeSpy = spyOn(toolbarEvents, 'toggleRedactionMode');
    component.toggleRedactBar();

    expect(toggleRedactionModeSpy).toHaveBeenCalled();
  });

  describe('keyboard navigation', () => {
    describe('onEscapeKey', () => {
      it('should close toolbar and return focus to main toolbar on Escape key', () => {
        const mockEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        const preventDefaultSpy = spyOn(mockEvent, 'preventDefault');
        const stopPropagationSpy = spyOn(mockEvent, 'stopPropagation');
        const toggleSpy = spyOn(component, 'toggleRedactBar');
        const focusSpy = spyOn(toolbarFocusService, 'focusToolbarButton');

        component.onEscapeKey(mockEvent);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(toggleSpy).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalledWith('#mvRedactBtn');
      });
    });

    describe('onArrowUp', () => {
      it('should return focus to main toolbar when ArrowUp pressed inside redaction toolbar', () => {
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

        expect(focusSpy).toHaveBeenCalledWith('#mvRedactBtn');
        document.body.removeChild(toolbar);
      });

      it('should not return focus when target is not inside redaction toolbar', () => {
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
