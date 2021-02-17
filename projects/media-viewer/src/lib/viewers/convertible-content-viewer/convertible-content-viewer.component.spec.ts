import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { Convert } from '../../store/actions/document.action';
import { GrabNDragDirective } from '../grab-n-drag.directive';
import { ResponseType, ViewerException } from '../viewer-exception.model';
import { ConvertibleContentViewerComponent } from './convertible-content-viewer.component';

describe('ConvertibleContentViewerComponent', () => {
  let component: ConvertibleContentViewerComponent;
  let fixture: ComponentFixture<ConvertibleContentViewerComponent>;
  const DOCUMENT_URL = '/documents/111/binary';
  const initialState = {
    'media-viewer': {
      document: {
        convertedDocument: {
          url: 'sample-url',
          error: ''
        }
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConvertibleContentViewerComponent,
        GrabNDragDirective
      ],
      imports: [
      ],
      providers: [
        provideMockStore({ initialState }),
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertibleContentViewerComponent);
    component = fixture.componentInstance;
    component.originalUrl = DOCUMENT_URL;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should convert original url',
    inject([Store], (store: Store<{}>) => {
      spyOn(store, 'dispatch');
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(new Convert('111'));
  }));

  it('should emit viewerException', fakeAsync(() => {
    spyOn(component.viewerException, "emit");
    component.onLoadException(new ViewerException());
    tick();

    expect(component.viewerException.emit).toHaveBeenCalled();
  }));

  it('should emit documentTitle', fakeAsync(() => {
    spyOn(component.documentTitle, "emit");
    component.onDocumentTitleChange("");
    tick();

    expect(component.documentTitle.emit).toHaveBeenCalled();
  }));

  it('should emit mediaLoadStatus', fakeAsync(() => {
    spyOn(component.mediaLoadStatus, 'emit');
    component.onMediaLoad(ResponseType.SUCCESS);
    tick();

    expect(component.mediaLoadStatus.emit).toHaveBeenCalled();
  }));
});
