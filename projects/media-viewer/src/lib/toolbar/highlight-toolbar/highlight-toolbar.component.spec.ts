/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HighlightToolbarComponent } from './highlight-toolbar.component';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers/reducers';
import { ToolbarEventService } from '../toolbar-event.service';
import { ToolbarButtonVisibilityService } from '../toolbar-button-visibility.service';

describe('HighlightToolbarComponent', () => {
  let component: HighlightToolbarComponent;
  let fixture: ComponentFixture<HighlightToolbarComponent>;
  let nativeElement;
  let toolbarService: ToolbarEventService;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [
        HighlightToolbarComponent,
      ],
      imports: [
        FormsModule,
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({}),
      ],
      providers: [ToolbarButtonVisibilityService, ToolbarEventService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightToolbarComponent);
    component = fixture.componentInstance;
    toolbarService = TestBed.inject(ToolbarEventService);
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
});
