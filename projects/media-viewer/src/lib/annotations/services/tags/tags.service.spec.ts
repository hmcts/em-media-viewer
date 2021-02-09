import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AnnotationApiService } from '../annotation-api/annotation-api.service';;
import { ToolbarEventService } from '../../../toolbar/toolbar-event.service';
import {TagsServices} from '../../services/tags/tags.services';
import {TagsComponent} from '../../tags/tags.component';
import {HttpClient} from '@angular/common/http';
import {TagInputModule} from 'ngx-chips';

describe('TagsService', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;
  let tagsService: TagsServices;

  const api = new AnnotationApiService({}  as any);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TagsComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        TagInputModule
      ],
      providers: [
        { provide: AnnotationApiService, useValue: api },
        ToolbarEventService,
        TagsServices
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    tagsService = new TagsServices(HttpClient as any);
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
  });

  it('should have getAllTags', () => {
    expect(tagsService.getAllTags).not.toBeNull();
  });

  it('should have tagItems', () => {
    expect(tagsService.tagItems).not.toBeNull();
  });

  it('should have updateTagItems', () => {
    expect(tagsService.updateTagItems).not.toBeNull();
  });

  it('should have getNewTags', () => {
    expect(tagsService.getNewTags).not.toBeNull();
  });

});
