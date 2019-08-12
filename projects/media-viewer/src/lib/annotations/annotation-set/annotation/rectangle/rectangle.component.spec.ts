import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RectangleComponent } from './rectangle.component';
import { FormsModule } from '@angular/forms';

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

  const mockHtmlElement : any = {
      style : {
        top : '0px',
        left : '300px',
        transform: {
          match(regex: any) :string {
            return '300,0';
          }
        }
      }
  };

  const mockIResizeEvent : any = {
      size : {
        width : 50,
        height : 50
      }
  };

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        RectangleComponent,
      ],
      imports: [
        FormsModule
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
    component.zoom = 1;
    component.selected = false;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a click', () => {
    spyOn(component.select, 'emit');
    component.onClick();

    expect(component.select.emit).toHaveBeenCalledTimes(1);
  });

  it('should select the rectangle if select is true.', () => {
    spyOn(component.rectElement.nativeElement, 'focus');
    component.selected = true;
    component.ngAfterContentInit();
    expect(component.rectElement.nativeElement.focus).toHaveBeenCalledTimes(1);
  });

});
