import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CtxToolbarComponent } from './ctx-toolbar.component';
import { By } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';
import { summaryFileName } from '@angular/compiler/src/aot/util';

describe('CtxToolbarComponent', () => {
  let component: CtxToolbarComponent;
  let fixture: ComponentFixture<CtxToolbarComponent>;
  const mockRectangle = {
    x: 100, y: 100, width: 100, height: 20,
    id: '16d5c513-15f9-4c39-8102-88bdb85d8831',
    annotationId: '4f3f9361-6d17-4689-81dd-5cb2e317b329',
    createdDate: '2018-05-28T08:48:33.206Z',
    createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
    createdByDetails: {
      'forename': 'Linus',
      'surname': 'Norton',
      'email': 'linus.norton@hmcts.net'
    },
    lastModifiedDate: '2019-05-28T08:48:33.206Z',
    lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
    lastModifiedByDetails: {
      'forename': 'Jeroen',
      'surname': 'Rijks',
      'email': 'jeroen.rijks@hmcts.net'
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CtxToolbarComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CtxToolbarComponent);
    component = fixture.componentInstance;
    component.rectangle = mockRectangle;

    fixture.detectChanges();
  });

  afterEach(() => {
    component.rectangle.x = 100;
    component.rectangle.y = 100;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set rectangle', function () {

  });

  it('should create highlight', function () {

  });

  it('should delete highlight', () => {
    const mockDeleteEvent = new EventEmitter();
    spyOn(mockDeleteEvent, 'emit');
    component.canDelete = true;
    fixture.detectChanges();

    component.deleteHighlightEvent = mockDeleteEvent;
    const deleteBtn = fixture.debugElement.query(By.css('button[title=Delete]'));
    deleteBtn.triggerEventHandler('mousedown', {});

    expect(mockDeleteEvent.emit).toHaveBeenCalledWith();
  });

  it('should create comment', () => {
    const mockCommentEvent = new EventEmitter();
    spyOn(mockCommentEvent, 'emit');
    component.canComment = true;
    fixture.detectChanges();

    component.addOrEditCommentEvent = mockCommentEvent;
    const commentBtn = fixture.debugElement.query(By.css('button[title=Comment]'));
    commentBtn.triggerEventHandler('mousedown', {});

    expect(mockCommentEvent.emit).toHaveBeenCalledWith();
  });

  it('adjust its position', () => {
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.left).toEqual('0px');
    expect(element.styles.top).toEqual('30px');
  });

  it('rotate 90 should align to top and horizontally with highlight', () => {
    component.rotate = 90;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.left).toEqual('30px');
    expect(element.styles.top).toEqual('350px');
  });

  it('rotate 180 should align to left and horizontally with highlight (accounting for highlight dimensions)', () => {
    component.rotate = 180;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.left).toEqual('0px');
    expect(element.styles.top).toEqual('130px');
  });

  it('rotate 270 should align to bottom and horizontally with highlight (accounting for highlight dimensions)', () => {
    component.rotate = 270;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.left).toEqual('270px');
    expect(element.styles.top).toEqual('0px');
  });

  it('top should default to 70px when annotation is at the top of the page', () => {
    component.rotate = 0;
    component.rectangle.y = 0;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.top).toEqual('70px');
  });

  it('rotate 90 should set top to calculated value when pop-up is not at the edge of the page', () => {
    component.rotate = 90;
    component.rectangle.y = 200;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.top).toEqual('385px');
  });

  it('rotate 90 should align top to the height of the page when annotation is at far left of page', () => {
    component.rotate = 90;
    component.rectangle.y = 600;
    component.height = 750;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.top).toEqual('750px');
  });

  it('rotate 270 should set top to calculated value when pop-up is not at the edge of the page', () => {
    component.rotate = 270;
    component.rectangle.y = 250;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.top).toEqual('85px');
  });

  it('rotate 270 should align top to 735px when annotation is at the far right of the page', () => {
    component.rotate = 270;
    component.rectangle.y = 900;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.top).toEqual('735px');
  });

  it('left should default to 0px when annotation is at the far left of the page', () => {
    component.rotate = 0;
    component.rectangle.x = 0;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.left).toEqual('0px');
  });

  it('left should default to 475px when annotation is at the far right of the page', () => {
    component.rotate = 0;
    component.rectangle.x = 600;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.left).toEqual('475px');
  });

  it('left should be set to calculated value when pop-up is not at the edge of the page', () => {
    component.rotate = 0;
    component.rectangle.x = 250;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.left).toEqual('125px');
  });

  it('rotate 180 should align left to width - defaultWidth when annotation is at the far left of the page', () => {
    component.rotate = 180;
    component.rectangle.x = 750;
    component.width = 350;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.left).toEqual('0px');
  });

  it('rotate 180 should set left to calculated value when pop-up is not at the edge of the page', () => {
    component.rotate = 180;
    component.rectangle.x = 250;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.left).toEqual('125px');
  });
});
