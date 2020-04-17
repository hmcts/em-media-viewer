import * as fromAnnotations from './annotatons.reducer';
import * as fromActions from '../actions/annotations.action';

const annotation = {
  annotations: [{
    createdBy: 'fab3a662-4375-42e8-850c-664b9daaa716',
    annotationId: '1234',
    createdByDetails: {
      forename: 'EM',
      surname: 'showcase',
      email: 'emshowcaseuser@hmcts.net'
    },
    lastModifiedByDetails: {
      forename: 'EM',
      surname: 'showcase',
      email: 'emshowcaseuser@hmcts.net'
    },
    createdDate: '2020-03-25T11:15:03.601Z',
    lastModifiedBy: 'fab3a662-4375-42e8-850c-664b9daaa716',
    lastModifiedDate: '2020-03-25T11:15:03.601Z',
    id: '961bd154-d0d4-40d2-bb9d-f0f0af772473',
    page: 1,
    color: 'FFFF00',
    annotationSetId: null,
    comments: [],
    tags: [],
    rectangles: [
      {
        createdBy: 'fab3a662-4375-42e8-850c-664b9daaa716',
        createdByDetails: {
          forename: 'EM',
          surname: 'showcase',
          email: 'emshowcaseuser@hmcts.net'
        },
        lastModifiedByDetails: {
          forename: 'EM',
          surname: 'showcase',
          email: 'emshowcaseuser@hmcts.net'
        },
        createdDate: '2020-03-25T11:15:03.659Z',
        lastModifiedBy: 'fab3a662-4375-42e8-850c-664b9daaa716',
        lastModifiedDate: '2020-03-25T11:15:03.659Z',
        id: 'b6239fb3-062e-4690-82e4-ac6d2f8e5769',
        x: 174,
        y: 159,
        width: 185,
        height: 139,
        annotationId: '961bd154-d0d4-40d2-bb9d-f0f0af772473'
      }
    ],
    type: 'highlight'
  }]};

describe('AnnotationReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromAnnotations;
      const action = {} as any;
      const state = fromAnnotations.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('ADD PAGE action', () => {
    it('should set pages', () => {
      const payload = {
          div: {},
          pageNumber: 3,
          scale: '1',
          rotation: '0'
        }
      const { initialState } = fromAnnotations;
      const action = new fromActions.AddPage(payload);
      const state = fromAnnotations.reducer(initialState, action);
      const pages = {
        numberOfPages: 3,
        styles: {
          left: undefined,
          height: undefined,
          width: undefined
        },
        scaleRotation: {
          scale: '1',
          rotation: '0'
        }
      }

      expect(state.pages).toEqual(pages);
    });
  });

  describe('LOAD_ANNOTATION_SET action', () => {
    it('should set loading to true', () => {
      const { initialState } = fromAnnotations;
      const action = new fromActions.LoadAnnotationSet('12345');
      const state = fromAnnotations.reducer(initialState, action);
      expect(state.loading).toEqual(true);
    });
  });

  describe('LOAD_ANNOTATION_SET_SUCCESS action', () => {
    it('should set annotation entities page entities and comment entities', () => {
      const { initialState } = fromAnnotations;
      const payload: any = annotation;
      const action = new fromActions.LoadAnnotationSetSucess(payload);
      const state = fromAnnotations.reducer(initialState, action);
      expect(state.loading).toEqual(false);
      expect(state.loaded).toEqual(true);
      // todo add the other exception once be is finished.
    });
  });

  describe('DELETE_ANNOTATION_SUCCESS action', () => {
    it('should delete annotations', () => {
      const { initialState } = fromAnnotations;
      const payload1: any = annotation;
      const action1 = new fromActions.LoadAnnotationSetSucess(payload1);
      const state = fromAnnotations.reducer(initialState, action1);
      const payload2 = annotation.annotations[0].id;
      const action = new fromActions.DeleteAnnotationSuccess(payload2);
      const state2 = fromAnnotations.reducer(state, action);
      expect(state2.annotationEntities).toEqual({});
      expect(state2.annotationPageEntities).toEqual({1: []});
    });
  });

  describe('ADD_OR_EDIT_COMMENT action', () => {
    it('should change comments', () => {
      const { initialState } = fromAnnotations;
      const payload: any = annotation.annotations[0];
      const action = new fromActions.AddOrEditComment(payload);
      const state = fromAnnotations.reducer(initialState, action);
      expect(state.commentEntities[annotation.annotations[0].annotationId]).toEqual(annotation.annotations[0]);
    });
  });

  describe('SELECT_ANNOTATION action', () => {
    it('should change comments', () => {
      const { initialState } = fromAnnotations;
      const payload2 = {annotationId: '1234', editable: true, selected: true};
      const action2 = new fromActions.SelectedAnnotation(payload2);
      const state2 =  fromAnnotations.reducer(initialState, action2);
      expect(state2.selectedAnnotation).toEqual(payload2);
    });
  });

  describe('SEARCH_COMMENT action', () => {
    it('should change comments', () => {
      const { initialState } = fromAnnotations;
      const payload2 = 'MY SEARCH TEXT';
      const action2 = new fromActions.SearchComment(payload2);
      const state2 =  fromAnnotations.reducer(initialState, action2);
      expect(state2.commentSearchQueries.commentSearch).toEqual(payload2);
    });
  });

});
