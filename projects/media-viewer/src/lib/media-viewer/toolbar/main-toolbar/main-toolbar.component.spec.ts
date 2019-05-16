import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MainToolbarComponent} from './main-toolbar.component';
import {ToolbarLeftPaneComponent} from '../left-pane/left-pane.component';
import {ToolbarRightPaneComponent} from '../right-pane/right-pane.component';
import {ToolbarMiddlePaneComponent} from '../middle-pane/middle-pane.component';
import {FormsModule} from '@angular/forms';

describe('MainToolbarComponent', () => {
  let component: MainToolbarComponent;
  let fixture: ComponentFixture<MainToolbarComponent>;
  let nativeElement;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        MainToolbarComponent,
        ToolbarLeftPaneComponent,
        ToolbarRightPaneComponent,
        ToolbarMiddlePaneComponent,
      ],
      imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainToolbarComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
