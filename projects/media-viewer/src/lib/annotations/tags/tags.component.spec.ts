import { ComponentFixture, TestBed } from '@angular/core/testing';
import {TagsComponent} from './tags.component';
import {TagInputModule} from 'ngx-chips';
import {TagsServices} from '../services/tags/tags.services';

describe('Tags Component', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [
        TagsComponent,
      ],
      imports: [TagInputModule],
      providers: [TagsServices]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display have tagItems, autocompleteItems', () => {
    fixture.detectChanges();
    expect(component.tagItems).toBeDefined();
    expect(component.autocompleteItems).toBeDefined();
  });

});
