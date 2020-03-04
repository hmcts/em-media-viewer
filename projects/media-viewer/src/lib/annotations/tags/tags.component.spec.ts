import { ComponentFixture, TestBed } from '@angular/core/testing';
import {TagsComponent} from './tags.component';
import {TagInputModule} from 'ngx-chips';
import {TagsServices} from '../services/tags/tags.services';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('Tags Component', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [
        TagsComponent,
      ],
      imports: [TagInputModule, HttpClientTestingModule, BrowserAnimationsModule],
      providers: [TagsServices],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    component.userId = '1234';
    component.tagItems = [];
    component.annoId = '123';
    component.editable = true;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display have tagItems, autocompleteItems', () => {
    fixture.detectChanges();
    expect(component.tagItems).toBeDefined();
    expect(component.userId).toBeDefined();
    expect(component.editable).toBeDefined();
    expect(component.annoId).toBeDefined();
  });

});
