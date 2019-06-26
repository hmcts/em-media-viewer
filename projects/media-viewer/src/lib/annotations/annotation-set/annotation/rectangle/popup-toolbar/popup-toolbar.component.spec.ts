import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupToolbarComponent } from './popup-toolbar.component';
import { By } from '@angular/platform-browser';

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
  }

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adjust its position', () => {
    const element = fixture.debugElement.query(By.css('div'));
    expect(element.styles.left).toEqual('-25px');
    expect(element.styles.top).toEqual('30px');
  });
});
