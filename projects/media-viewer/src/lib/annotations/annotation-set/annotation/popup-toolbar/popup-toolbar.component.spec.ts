import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupToolbarComponent } from './popup-toolbar.component';
import { By } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';

describe('PopupToolbarComponent', () => {
  let component: PopupToolbarComponent;
  let fixture: ComponentFixture<PopupToolbarComponent>;
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupToolbarComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PopupToolbarComponent);
    component = fixture.componentInstance;
    component.rectangle = mockRectangle;

    fixture.detectChanges();
  }));

  afterEach(() => {
    component.rectangle.x = 100;
    component.rectangle.y = 100;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete highlight', () => {
    const mockDeleteEvent = new EventEmitter();
    spyOn(mockDeleteEvent, 'emit');
    component.deleteHighlight = mockDeleteEvent;
    const deleteBtn = fixture.debugElement.query(By.css('button[title=Delete]'));
    deleteBtn.triggerEventHandler('mousedown', {});

    expect(mockDeleteEvent.emit).toHaveBeenCalledWith();
  });

  it('should create comment', () => {
    const mockCommentEvent = new EventEmitter();
    spyOn(mockCommentEvent, 'emit');
    component.addOrEditComment = mockCommentEvent;
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
    expect(element.styles.top).toEqual('285px');
  });

  it('rotate 180 should align to left and horizontally with highlight (accounting for highlight dimensions)', () => {
    component.rotate = 180;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.left).toEqual('-25px');
    expect(element.styles.top).toEqual('130px');
  });

  it('rotate 270 should align to bottom and horizontally with highlight (accounting for highlight dimensions)', () => {
    component.rotate = 270;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.left).toEqual('270px');
    expect(element.styles.top).toEqual('0px');
  });

  it('top should default to 30px when annotation is at the top of the page', () => {
    component.rectangle.y = 0;
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.top).toEqual('30px');
  });

  it('left should default to 0px when annotation is at the far left of the page', () => {
    component.rectangle.x = 0;
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.left).toEqual('0px');
  });
});
