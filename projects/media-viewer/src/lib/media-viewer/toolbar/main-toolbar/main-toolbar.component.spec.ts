import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MainToolbarComponent } from './main-toolbar.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SubToolbarComponent } from '../sub-toolbar/sub-toolbar.component';
import { ToolbarLeftPaneComponent } from '../left-pane/left-pane.component';
import { ToolbarRightPaneComponent } from '../right-pane/right-pane.component';
import { ToolbarMiddlePaneComponent } from '../middle-pane/middle-pane.component';

describe('MainToolbarComponent', () => {
  let component: MainToolbarComponent;
  let fixture: ComponentFixture<MainToolbarComponent>;
  let nativeElement;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [
        MainToolbarComponent,
        SideBarComponent,
        SearchBarComponent,
        SubToolbarComponent,
        ToolbarLeftPaneComponent,
        ToolbarRightPaneComponent,
        ToolbarMiddlePaneComponent,
      ]
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

  it('should not show sidebar', async(() => {
    const outerContainer = nativeElement.querySelector('div[id=outerContainer]');
    expect(outerContainer.className).toBe("");
  }));

  it('should show open sidebar', async(() => {
    component.toggleSidebarOpen.next(true);
    fixture.detectChanges();

    const outerContainer = nativeElement.querySelector('div[id=outerContainer]');
    expect(outerContainer.className).toBe("toggleSidebarOpen");
  }));
});
