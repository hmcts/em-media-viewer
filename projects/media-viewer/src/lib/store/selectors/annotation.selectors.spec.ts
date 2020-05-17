import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import {initialState, reducers, State} from '../reducers/reducers';

import * as fromSelectors from './annotations.selectors';
import * as fromActions from '../actions/annotations.action';
import * as fromTags from '../actions/tags.actions';
  const comment = {
    createdBy: 'b3afcb72-5e30-49cd-b833-88ab7aab619b',
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
    createdDate: '2020-04-17T12:54:26.117Z',
    lastModifiedBy: 'b3afcb72-5e30-49cd-b833-88ab7aab619b',
    lastModifiedDate: '2020-04-17T12:54:34.417Z',
    id: '9f84cb89-8286-4602-a3b9-672c15efc7eb',
    content: 'this is my comment',
    annotationId: 'c3adf070-353b-45d2-9a84-c912851cf34d'
  };
  const tags = [
      {
        name: 'important',
        createdBy: 'b3afcb72-5e30-49cd-b833-88ab7aab619b',
        label: 'important',
        color: null
      }
    ]
  const anno = {
    createdBy: 'b3afcb72-5e30-49cd-b833-88ab7aab619b',
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
    createdDate: '2020-04-17T11:52:06.344Z',
    lastModifiedBy: 'b3afcb72-5e30-49cd-b833-88ab7aab619b',
    lastModifiedDate: '2020-04-17T11:52:06.344Z',
    id: 'c3adf070-353b-45d2-9a84-c912851cf34d',
    page: 1,
    color: 'FFFF00',
    annotationSetId: '200bcec6-d9cf-4866-b208-f2cc5db77279',
    comments: [
      comment
    ],
    tags,
    rectangles: [
      {
        createdBy: 'b3afcb72-5e30-49cd-b833-88ab7aab619b',
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
        createdDate: '2020-04-17T11:52:06.409Z',
        lastModifiedBy: 'b3afcb72-5e30-49cd-b833-88ab7aab619b',
        lastModifiedDate: '2020-04-17T11:52:06.409Z',
        id: '10baecbb-7882-4efc-8da7-b694b180309e',
        x: 148,
        y: 673,
        width: 325,
        height: 173,
        annotationId: 'c3adf070-353b-45d2-9a84-c912851cf34d'
      }
    ],
    type: 'highlight',
    positionTop: 673
  }
  const annotationEntities = {
    'c3adf070-353b-45d2-9a84-c912851cf34d': {
      ...anno
    }
  };

  const annoSet: any = {
    createdBy: 'b3afcb72-5e30-49cd-b833-88ab7aab619b',
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
    createdDate: '2020-03-31T07:40:44.929Z',
    lastModifiedBy: 'b3afcb72-5e30-49cd-b833-88ab7aab619b',
    lastModifiedDate: '2020-03-31T07:40:44.929Z',
    id: '200bcec6-d9cf-4866-b208-f2cc5db77279',
    documentId: 'assets/example4.pdf',
    annotations: [
      anno
    ]

  };

const commentEntities = {
  'c3adf070-353b-45d2-9a84-c912851cf34d': {
    createdBy: 'b3afcb72-5e30-49cd-b833-88ab7aab619b',
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
    createdDate: '2020-04-17T12:54:26.117Z',
      lastModifiedBy: 'b3afcb72-5e30-49cd-b833-88ab7aab619b',
      lastModifiedDate: '2020-04-17T12:54:34.417Z',
      id: '9f84cb89-8286-4602-a3b9-672c15efc7eb',
      content: 'this is my comment',
      annotationId: 'c3adf070-353b-45d2-9a84-c912851cf34d',
      tags: [
      {
        name: 'important',
        createdBy: 'b3afcb72-5e30-49cd-b833-88ab7aab619b',
        label: 'important',
        color: null
      }
    ]
  }
};

const annotationPageEntities = {
  '1': [
    anno
  ]
}

describe('Annotations selectors', () => {
  let store: Store<State>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers),
      ],
    });
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getAnnotationsSetState', () => {
    it('should return initial state', () => {
      let result;
      store.pipe(select(fromSelectors.getAnnotationsSetState)).subscribe(value => {
        result = value;
      });
      expect(result).toEqual(initialState);
    });
  });


  describe('getAnnotationEntities', () => {
    it('should return Annotations Entities', () => {
      let result;
      store.pipe(select(fromSelectors.getAnnotationEntities)).subscribe(value => {
        result = value;
      });
      expect(result).toEqual({});
      store.dispatch(new fromActions.SaveAnnotationSuccess(anno));
      expect(result).toEqual(annotationEntities);
    });
  });

  describe('getSet', () => {
    it('should return AnnotationsSet', () => {
      let result;
      store.pipe(select(fromSelectors.getSet)).subscribe(value => {
        result = value;
      });
      expect(result).toEqual({});
      store.dispatch(new fromActions.LoadAnnotationSetSucess(annoSet));
      expect(result).toEqual(annoSet);
    });
  });

  describe('getDocumentIdSetId', () => {
    it('should return document and annoSet id', () => {
      let result;
      store.pipe(select(fromSelectors.getDocumentIdSetId)).subscribe(value => {
        result = value;
      });
      store.dispatch(new fromActions.LoadAnnotationSetSucess(annoSet));
      const expected = {
        documentId: 'assets/example4.pdf',
        annotationSetId: '200bcec6-d9cf-4866-b208-f2cc5db77279'
      }
      expect(result).toEqual(expected);
    });
  });

  describe('getAnnotationSet', () => {
    it('should return should return Annotation Set', () => {
      let result;
      store.pipe(select(fromSelectors.getAnnotationSet)).subscribe(value => {
        result = value;
      });
      store.dispatch(new fromActions.LoadAnnotationSetSucess(annoSet));
      const expected = {
        ...annoSet,
        annotations: Object.keys(annotationEntities).map(key => annotationEntities[key])
      };
      expect(result).toEqual(expected);
    });
  });

  describe('getSelectedAnnotation', () => {
    it('should return selected annotation obj', () => {
      let result;
      store.pipe(select(fromSelectors.getSelectedAnnotation)).subscribe(value => {
        result = value;
      });
      expect(result).toEqual(initialState.selectedAnnotation);
      const payload = {
        annotationId: 'c3adf070-353b-45d2-9a84-c912851cf34d',
        editable: false,
        selected: true
      };
      store.dispatch(new fromActions.SelectedAnnotation(payload));
      expect(result).toEqual(payload);
    });
  });

  describe('getAnnCommentsEntities', () => {
    it('should return selected comment entities', () => {
      let result;
      store.pipe(select(fromSelectors.getAnnComments)).subscribe(value => {
        result = value;
      });
      store.dispatch(new fromActions.LoadAnnotationSetSucess(annoSet));
      expect(result).toEqual(commentEntities);
    });
  });

  describe('getPageEntities', () => {
    it('should return selected annotation obj', () => {
      let result;
      store.pipe(select(fromSelectors.getPageEntities)).subscribe(value => {
        result = value;
      });
      store.dispatch(new fromActions.LoadAnnotationSetSucess(annoSet));
      expect(result).toEqual(annotationPageEntities);
    });
  });

  describe('getAnnoPages', () => {
    it('should return selected annotation obj', () => {
      let result;
      store.pipe(select(fromSelectors.getAnnoPages)).subscribe(value => {
        result = value;
      });
      const payload: any = {
        div: {},
        pageNumber: 1,
          scale: 1,
          rotation: 0
      };
      store.dispatch(new fromActions.AddPage(payload));
      const expected = {
        numberOfPages: 1,
        styles: {
          left: undefined,
          height: undefined,
          width: undefined
        },
        scaleRotation: {
          scale: 1,
          rotation: 0
        }
      };
      expect(result).toEqual(expected);
    });
  });

  describe('getComponentSearchQueries', () => {
    it('should return search query', () => {
      let result;
      store.pipe(select(fromSelectors.getComponentSearchQueries)).subscribe(value => {
        result = value;
      });
      store.dispatch(new fromActions.SearchComment('this'));
      expect(result).toEqual({commentSearch: 'this',});
    });
  });

  describe('getComponentSearchText', () => {
    it('should return search query', () => {
      let result;
      store.pipe(select(fromSelectors.getComponentSearchText)).subscribe(value => {
        result = value;
      });
      store.dispatch(new fromActions.SearchComment('this'));
      expect(result).toEqual('this');
    });
  });

  describe('getAnnoPerPage', () => {
    it('should return annotations per page', () => {
      let result;
      store.pipe(select(fromSelectors.getAnnoPerPage)).subscribe(value => {
        result = value;
      });
      const payload: any = {
        div: {},
        pageNumber: 1,
        scale: 1,
        rotation: 0
      };
      store.dispatch(new fromActions.LoadAnnotationSetSucess(annoSet));
      store.dispatch(new fromActions.AddPage(payload));
      const expected = [
        {
          anno: [anno],
          styles: {left: undefined, height: undefined, width: undefined}
        }
      ]
      expect(result).toEqual(expected);
    });
  });

  xdescribe('getCommentsArray', () => {
    it('should return array of comments', () => {
      let result;
      store.pipe(select(fromSelectors.getCommentsArray)).subscribe(value => {
        result = value;
      });

      const payload: any = {
        div: {},
        pageNumber: 1,
        scale: 1,
        rotation: 0
      };
      store.dispatch(new fromActions.LoadAnnotationSetSucess(annoSet));
      store.dispatch(new fromActions.AddPage(payload));
      store.dispatch(new fromTags.AddFilterTags({important: false}));
      const expected = [
        {...comment, tags}
      ];
      expect(result).toEqual(expected);
    });
  });

  describe('getFilteredAnnotations', () => {
    it('should return array of comments', () => {
      let result;
      store.pipe(select(fromSelectors.getFilteredAnnotations)).subscribe(value => {
        result = value;
      });

      const payload: any = {
        div: {},
        pageNumber: 1,
        scale: 1,
        rotation: 0
      };
      store.dispatch(new fromActions.LoadAnnotationSetSucess(annoSet));
      store.dispatch(new fromActions.AddPage(payload));
      store.dispatch(new fromTags.AddFilterTags({important: false}));
      expect(result).toEqual([anno]);
    });
  });

});
