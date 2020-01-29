import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ErrorMessageComponent} from './error.message.component';
import {By} from '@angular/platform-browser';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [
        ErrorMessageComponent,
      ],
      imports: []
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message', () => {
    component.errorMessage = 'errorx';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.error-message')).nativeElement.textContent).toBe('errorx');
  });

});
