import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RectangleComponent } from './rectangle.component';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';

describe('RectangleComponent', () => {
  let component: RectangleComponent;
  let fixture: ComponentFixture<RectangleComponent>;
  let nativeElement;
  const mockRectangle = {
      id: '16d5c513-15f9-4c39-8102-88bdb85d8831',
      createdBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
      createdByDetails: {
          'forename': 'Linus',
          'surname': 'Norton',
          'email': 'linus.norton@hmcts.net'
        },
      createdDate: '2018-05-28T08:48:33.206Z',
      lastModifiedBy: 'ea6d959c-b6c9-48af-89c2-6f7bd796524d',
      lastModifiedByDetails: {
          'forename': 'Jeroen',
          'surname': 'Rijks',
          'email': 'jeroen.rijks@hmcts.net'
        },
      lastModifiedDate: '2019-05-28T08:48:33.206Z',
      annotationId: '123annotationId',
      height: 100,
      width: 50,
      x: 5,
      y: 10,
  };

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        RectangleComponent,
      ],
      imports: [
        FormsModule,
        AngularDraggableModule,
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleComponent);
    component = fixture.componentInstance;
    component.rectangle = mockRectangle;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a click', () => {
    const clickEmitEventSpy = spyOn(component.click, 'emit');
    component.onClick();

    expect(clickEmitEventSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit delete event', () => {
    const deleteEventSpy = spyOn(component.delete, 'emit');

    component.deleteHighlight();

    expect(deleteEventSpy).toHaveBeenCalledWith(mockRectangle.id);
  });
});
