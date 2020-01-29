import { AnnotationEventService, SelectionAnnotation } from './annotation-event.service';
import { fakeAsync } from '@angular/core/testing';


describe('AnnotationEventService', () => {
  let annotationService: AnnotationEventService;
  beforeEach(() => { annotationService = new AnnotationEventService(); });

  it('should select the text', () => {
    const selectedAnnotation: SelectionAnnotation = { annotationId: '123', editable: false };
    spyOn(annotationService.selectedAnnotation, 'next');
    annotationService.selectAnnotation(selectedAnnotation);

    expect(annotationService.selectedAnnotation.next).toHaveBeenCalledTimes(1);
    expect(annotationService.selectedAnnotation.next).toHaveBeenCalledWith(selectedAnnotation);
  });


  it('get the selected annotation', fakeAsync(() => {
    const selectedAnnotation = { annotationId: '123', editable: false };
    let annotation = {};
    annotationService.getSelectedAnnotation().subscribe(res => annotation = res);
    annotationService.selectedAnnotation.next(selectedAnnotation);

    expect(annotation).toBe(selectedAnnotation)
  }));
});
