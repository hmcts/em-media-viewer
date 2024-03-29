import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RedactionComponent } from './redaction.component';
import { Store, StoreModule } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromActions from '../../store/actions/redaction.actions';
import { ViewerEventService } from '../../viewers/viewer-event.service';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { reducers } from '../../store/reducers/reducers';
import any = jasmine.any;

describe('RedactionComponent', () => {
  let component: RedactionComponent;
  let fixture: ComponentFixture<RedactionComponent>;
  const highlightService = { getRectangles: () => {} };
  const viewerEvents = { textHighlight: { subscribe: () => new Subscription() } };
  const toolbarEvents = {
    drawModeSubject: { subscribe: () => new Subscription(), next: () => {}, },
    highlightModeSubject: { subscribe: () => new Subscription(), next: () => {}, },
    applyRedactToDocument: { subscribe: () => new Subscription(), next: () => {}, },
    clearAllRedactMarkers: { subscribe: () => new Subscription(), next: () => {}, },
  };

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [RedactionComponent],
      providers: [
        { provide: ViewerEventService, useValue: viewerEvents },
        { provide: ToolbarEventService, useValue: toolbarEvents }
      ],
      imports: [
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should mark Text for Redaction',
    inject([Store], (store) => {
      spyOn(toolbarEvents.highlightModeSubject, 'next');
      spyOn(store, 'dispatch');
      component.documentId = 'documentId';
      const redactionId = any(String) as any;

      component.markTextRedaction({ page: 1, rectangles: ['highlight'] });

      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.SaveRedaction({
        page: 1, rectangles: ['highlight' as any], documentId: 'documentId', redactionId
      }));
    })
  );

  it('should dispatch DeleteRedaction', inject([Store], (store) => {
    spyOn(store, 'dispatch');

    component.onMarkerDelete({});

    expect(store.dispatch).toHaveBeenCalledWith(new fromActions.DeleteRedaction({} as any));
  }));

  it('should select redaction', inject([Store], (store) => {
    spyOn(store, 'dispatch');

    component.selectRedaction({});

    expect(store.dispatch).toHaveBeenCalledWith(new fromActions.SelectRedaction({} as any));
  }));

  it('should save redaction',
    inject([Store, ToolbarEventService], (store, toolbarEventService) => {
      spyOn(store, 'dispatch');
      spyOn(toolbarEventService.drawModeSubject, 'next');
      component.documentId = 'documentId';
      const redactionId = any(String) as any;
      const rectangles = ['rectangle' as any];

      component.markBoxRedaction({ rectangles, page: 1 });

      expect(store.dispatch).toHaveBeenCalledWith(new fromActions.SaveRedaction({
        page: 1, rectangles, redactionId, documentId: 'documentId'
      }));
      expect(toolbarEventService.drawModeSubject.next).toHaveBeenCalledWith(false);
    })
  );

  it('should update marker', inject([Store], (store) => {
    spyOn(store, 'dispatch');

    component.onMarkerUpdate({});

    expect(store.dispatch).toHaveBeenCalledWith(new fromActions.SaveRedaction({}));
  }));

  it('should download redacted document', inject([Store], (store) => {
    const anchor = {
      setAttribute: () => {}, click: () => {}, remove: () => {}, href: undefined, download: undefined
    } as any;
    spyOn(anchor, 'click');
    spyOn(anchor, 'remove');
    spyOn(store, 'dispatch');
    spyOn(URL, 'createObjectURL').and.returnValue('url');
    spyOn(URL, 'revokeObjectURL');
    spyOn(document.body, 'appendChild');
    spyOn(document, 'createElement').and.returnValue(anchor);

    const blob: Blob = new Blob();

    component.downloadDocument({ blob: blob, filename: 'filename'});

    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(URL.revokeObjectURL).toHaveBeenCalled();
    expect(anchor.click).toHaveBeenCalled();
    expect(anchor.remove).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new fromActions.ResetRedactedDocument());
  }));
});
