import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { reducers, State } from '../reducers/reducers';

import * as fromSelectors from './annotations.selectors';
import * as fromActions from '../actions/annotations.action';
import * as fromDocument from '../actions/document.action';
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
      const payload: any = [{
        div: {},
        scale: 1,
        rotation: 0,
        id: '1'
      }];
      store.dispatch(new fromActions.LoadAnnotationSetSucess({ status: 200, body: annoSet }));
      store.dispatch(new fromDocument.AddPages(payload));
      const expected = [
        {
          anno: [anno],
          styles: {left: undefined, height: undefined, width: undefined}
        }
      ]
      expect(result).toEqual(expected);
    });
  });

  describe('getCommentsArray', () => {
    it('should return array of comments', () => {
      let result;
      store.pipe(select(fromSelectors.getCommentsArray)).subscribe(value => {
        result = value;
      });

      const payload: any = [{
        div: {},
        id: '1',
        scale: 1,
        rotation: 0
      }];
      store.dispatch(new fromActions.LoadAnnotationSetSucess({ status: 200, body: annoSet }));
      store.dispatch(new fromDocument.AddPages(payload));
      store.dispatch(new fromTags.AddFilterTags({ important: false }));
      const pages =  {
        '1': {
          scaleRotation: { scale: 1, rotation: 0 },
          styles: { left: undefined, height: undefined, width: undefined }
        }
      }
      const expected = [
        {...comment, tags, page: 1, pages}
      ];
      expect(result).toEqual(expected);
    });
  });


  describe('getCommentsSummaryArray', () => {
    it('should return array of comments', () => {
      let result;
      store.pipe(select(fromSelectors.getCommentSummary)).subscribe(value => {
        result = value;
      });

      const payload: any = [{
        div: {},
        id: '1',
        scale: 1,
        rotation: 0
      }];
      store.dispatch(new fromActions.LoadAnnotationSetSucess({ status: 200, body: annoSet }));
      store.dispatch(new fromDocument.AddPages(payload));
      store.dispatch(new fromTags.AddFilterTags({ important: false }));

      const expected = [{
        comment: 'this is my comment',
        date: '17 April 2020',
        page: 1,
        tags: [{
          color: null,
          createdBy: 'b3afcb72-5e30-49cd-b833-88ab7aab619b',
          label: 'important',
          name: 'important'
        }],
        user: 'EM showcase'
      }];
      expect(result).toEqual(expected);
    });
  });

  describe('getFilteredAnnotations', () => {
    it('should return array of comments', () => {
      let result;
      store.pipe(select(fromSelectors.getFilteredAnnotations)).subscribe(value => {
        result = value;
      });

      const payload: any = [{
        div: {},
        id: '1',
        scale: 1,
        rotation: 0
      }];
      store.dispatch(new fromActions.LoadAnnotationSetSucess({ status: 200, body: annoSet }));
      store.dispatch(new fromDocument.AddPages(payload));
      store.dispatch(new fromTags.AddFilterTags({ important: false }));
      expect(result).toEqual([anno]);
    });
  });

  describe('getCommentSummary', () => {
    it('should return array of comment summary', () => {
      let result;
      store.pipe(select(fromSelectors.getCommentSummary)).subscribe(value => {
        result = value;
      });

      const payload: any = [{
        div: {},
        id: '1',
        scale: 1,
        rotation: 0
      }];
      store.dispatch(new fromActions.LoadAnnotationSetSucess({ status: 200, body: annoSet }));
      store.dispatch(new fromDocument.AddPages(payload));
      const cm = {
        comment: 'this is my comment',
        date: '17 April 2020',
        page: 1,
        tags: [{
          color: null,
          createdBy: 'b3afcb72-5e30-49cd-b833-88ab7aab619b',
          label: 'important',
           name: 'important'
        }],
        user: 'EM showcase'
      };
      store.dispatch(new fromTags.AddFilterTags({ important: false }));

      expect(result).toEqual([cm]);
    });
  });

});
