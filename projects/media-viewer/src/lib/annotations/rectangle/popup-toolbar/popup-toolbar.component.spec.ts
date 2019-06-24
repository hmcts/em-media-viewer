import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupToolbarComponent } from './popup-toolbar.component';
import { By } from '@angular/platform-browser';

describe('PopupToolbarComponent', () => {
  let component: PopupToolbarComponent;
  let fixture: ComponentFixture<PopupToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupToolbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupToolbarComponent);
    component = fixture.componentInstance;
    component.top = 100;
    component.left = 100;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adjust its position', () => {
    const element = fixture.debugElement.query(By.css('div'));
    console.log(element.styles);

    expect(element.styles.left).toEqual((component.left - 175 ) + 'px');
    expect(element.styles.top).toEqual((component.top - 70) + 'px');
  });
});
