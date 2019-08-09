import { AnnotationService, SelectionAnnotation } from './annotation.service';


describe('AnnotationService', () => {
  let annotationService: AnnotationService;
  beforeEach(() => { annotationService = new AnnotationService(); });

  it('should select the text', () => {
    const selectedAnnotation: SelectionAnnotation = { annotationId: '123', editable: false };
    spyOn(annotationService.selectedAnnotation, 'next');
    annotationService.onAnnotationSelection(selectedAnnotation);

    expect(annotationService.selectedAnnotation.next).toHaveBeenCalledTimes(1);
    expect(annotationService.selectedAnnotation.next).toHaveBeenCalledWith(selectedAnnotation);
  });


  it('get the selected annotation', async () => {
    const selectedAnnotation: SelectionAnnotation = { annotationId: '123', editable: false };
    annotationService.selectedAnnotation.next(selectedAnnotation);

    annotationService.getSelectedAnnotation().subscribe(annotation => expect(annotation).toBe(selectedAnnotation));
  });
});
