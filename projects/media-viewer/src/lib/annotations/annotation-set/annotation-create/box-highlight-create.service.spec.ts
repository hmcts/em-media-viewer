import { BoxHighlightCreateService } from './box-highlight-create.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { AnnotationSet } from '../annotation-set.model';
import { of } from 'rxjs';


xdescribe('BoxHighlightCreateService', () => {

  const mockDrawModeSubject = { next: () => {} };
  const toolbarEvents = { drawModeSubject: mockDrawModeSubject } as any;
  const annotationApi = { postAnnotation: () => {}} as any;
  const annotationEvents = { selectAnnotation: () => {}} as any;


  let service: BoxHighlightCreateService;

  beforeEach(() => {
    service = new BoxHighlightCreateService(toolbarEvents, annotationApi, annotationEvents);
  });

  it('should init box highlight', () => {
    spyOn(service.initHighlight, 'next');

    service.initBoxHighlight({} as MouseEvent);

    expect(service.initHighlight.next).toHaveBeenCalled();
  });

  it('should update box highlight', () => {
    spyOn(service.updateHighlight, 'next');

    service.updateBoxHighlight({} as MouseEvent);

    expect(service.updateHighlight.next).toHaveBeenCalled();
  });

  it('should save box highlight', fakeAsync(() => {
    const mockAnnoSet = { annotations: []} as AnnotationSet;

    spyOn(annotationApi, 'postAnnotation').and.returnValue(of({ id: 'annoId' }));
    spyOn(annotationEvents, 'selectAnnotation');
    spyOn(mockDrawModeSubject, 'next');

    service.saveBoxHighlight({ height: 6 }, mockAnnoSet, 3);
    tick();

    expect(annotationApi.postAnnotation).toHaveBeenCalled();
    expect(annotationEvents.selectAnnotation).toHaveBeenCalledWith({ annotationId: 'annoId', editable: false });
  }));

});
