import * as fromAnnotations from './annotations.action';

describe('Annotations actions', () => {
  describe('Load Annotation Set', () => {
    describe('Load Annotation Set', () => {
      it('should create an action', () => {
        const action = new fromAnnotations.LoadAnnotationSet('1234567');
        expect({ ...action }).toEqual({
          type: fromAnnotations.LOAD_ANNOTATION_SET,
          payload: '1234567'
        });
      });
    });
    describe('LoadAnnotationSetSuccess', () => {
      it('should create an action', () => {
        const payload: any = {documentId: 'something', annotations: []};
        const action = new fromAnnotations.LoadAnnotationSetSucess(payload);
        expect({ ...action }).toEqual({
          type: fromAnnotations.LOAD_ANNOTATION_SET_SUCCESS,
          payload
        });
      });
    });
    describe('LoadFeeAccountsFail', () => {
      it('should create an action', () => {
        const error: any = 'some error';
        const action = new fromAnnotations.LoadAnnotationSetFail(error);
        expect({ ...action }).toEqual({
          type: fromAnnotations.LOAD_ANNOTATION_SET_FAIL,
          payload: error
        });
      });
    });
  });


  describe('Save Annotation', () => {
    describe('SaveAnnotation', () => {
      it('should create an action', () => {
        const action = new fromAnnotations.SaveAnnotation('1234567');
        expect({ ...action }).toEqual({
          type: fromAnnotations.SAVE_ANNOTATION,
          payload: '1234567'
        });
      });
    });
    describe('SaveAnnotation Success', () => {
      it('should create an action', () => {
        const payload: any = {documentId: 'something', annotations: []};
        const action = new fromAnnotations.SaveAnnotationSuccess(payload);
        expect({ ...action }).toEqual({
          type: fromAnnotations.SAVE_ANNOTATION_SUCCESS,
          payload
        });
      });
    });
    describe('SaveAnnotationFail', () => {
      it('should create an action', () => {
        const error: any = 'some error';
        const action = new fromAnnotations.SaveAnnotationFail(error);
        expect({ ...action }).toEqual({
          type: fromAnnotations.SAVE_ANNOTATION_FAIL,
          payload: error
        });
      });
    });
  });

  describe('Delete Annotation', () => {
    describe('Delete Annotation', () => {
      it('should create an action', () => {
        const action = new fromAnnotations.DeleteAnnotation('1234567');
        expect({ ...action }).toEqual({
          type: fromAnnotations.DELETE_ANNOTATION,
          payload: '1234567'
        });
      });
    });
    describe('DeleteAnnotationSuccess', () => {
      it('should create an action', () => {
        const payload: any = 'some1234id';
        const action = new fromAnnotations.DeleteAnnotationSuccess(payload);
        expect({ ...action }).toEqual({
          type: fromAnnotations.DELETE_ANNOTATION_SUCCESS,
          payload
        });
      });
    });
    describe('DeleteAnnotationFail', () => {
      it('should create an action', () => {
        const error: any = 'some error';
        const action = new fromAnnotations.DeleteAnnotationFail(error);
        expect({ ...action }).toEqual({
          type: fromAnnotations.DELETE_ANNOTATION_FAIL,
          payload: error
        });
      });
    });
  });

  describe('Search Comment', () => {
    it('should create an action', () => {
      const payload = 'query text';
      const action = new fromAnnotations.SearchComment(payload);
      expect({ ...action }).toEqual({
        type: fromAnnotations.SEARCH_COMMENT,
        payload
      });
    });
  });

  describe('Select Annotation', () => {
    it('should create an action', () => {
      const payload = {annotationId: '1234', editable: true, selected: true};
      const action = new fromAnnotations.SelectedAnnotation(payload);
      expect({ ...action }).toEqual({
        type: fromAnnotations.SELECT_ANNOTATION,
        payload
      });
    });
  });

  describe('AddOrEditComment', () => {
    it('should create an action', () => {
      const payload: any = {annotationSetId: '1234', annotationId: true, page: true};
      const action = new fromAnnotations.AddOrEditComment(payload);
      expect({ ...action }).toEqual({
        type: fromAnnotations.ADD_OR_EDIT_COMMENT,
        payload
      });
    });
  });
});
