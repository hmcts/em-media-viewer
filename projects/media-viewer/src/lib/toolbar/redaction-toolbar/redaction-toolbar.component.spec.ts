import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers/reducers';
import { RedactionToolbarComponent } from './redaction-toolbar.component';
import { ToolbarEventService } from '../toolbar-event.service';

describe('RedactionToolbarComponent', () => {
  let component: RedactionToolbarComponent;
  let fixture: ComponentFixture<RedactionToolbarComponent>;
  let toolbarEvents: ToolbarEventService;
  const toolbarEventsMock = {
    highlightModeSubject: { next: () => {} },
    drawModeSubject: { next: () => {} },
    toggleRedactionPreview: () => {},
    unmarkAll: () => {},
    applyRedactionToDocument: () => {},
    toggleRedactionMode: () => {},
  };

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [RedactionToolbarComponent],
      imports: [
        FormsModule,
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      providers: [{ provide: ToolbarEventService, useValue: toolbarEventsMock }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedactionToolbarComponent);
    component = fixture.componentInstance;
    toolbarEvents = TestBed.inject(ToolbarEventService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
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

  it('should call toggleRedactionMode', () => {
    const toggleRedactionModeSpy = spyOn(toolbarEvents, 'toggleRedactionMode');
    component.toggleRedactBar();

    expect(toggleRedactionModeSpy).toHaveBeenCalled();
  });
});
