import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';


import * as fromSelectors from './tags.selectors';
import * as fromActions from '../actions/annotations.action';
import * as fromTags from '../actions/tags.actions';
import {initialTagState, reducers, State} from '../reducers/reducers';
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
];
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
};


describe('Tags selectors', () => {
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

  describe('getTagsRootState', () => {
    it('should return initial state', () => {
      let result;
      store.pipe(select(fromSelectors.getTagsRootState)).subscribe(value => {
        result = value;
      });
      expect(result).toEqual(initialTagState);
    });
  });

  describe('getTagEntities', () => {
    it('should return tag entities', () => {
      let result;
      store.pipe(select(fromSelectors.getTagEntities)).subscribe(value => {
        result = value;
      });

      store.dispatch(new fromActions.SaveAnnotationSuccess(anno));
      const expected = {
        important: {
          'c3adf070-353b-45d2-9a84-c912851cf34d': 'c3adf070-353b-45d2-9a84-c912851cf34d'
        }
      };
      expect(result).toEqual(expected);
    });
  });

  describe('getTagFilters', () => {
    it('should return array of tag filters', () => {
      let result;
      store.pipe(select(fromSelectors.getTagFilters)).subscribe(value => {
        result = value;
      });

      store.dispatch(new fromActions.SaveAnnotationSuccess(anno));
      store.dispatch(new fromTags.AddFilterTags({important: true}));
      expect(result).toEqual(['important']);
    });
  });

  describe('getTagFiltered', () => {
    it('should return filtered tags', () => {
      let result;
      store.pipe(select(fromSelectors.getTagFiltered)).subscribe(value => {
        result = value;
      });

      store.dispatch(new fromActions.SaveAnnotationSuccess(anno));
      store.dispatch(new fromTags.AddFilterTags({important: true}));
      const expected = {
        'c3adf070-353b-45d2-9a84-c912851cf34d': 'c3adf070-353b-45d2-9a84-c912851cf34d'
      };
      expect(result).toEqual(expected);
    });
  });

  describe('getFilteredPageEntities', () => {
    it('should return filtered page annotations', () => {
      let result;
      store.pipe(select(fromSelectors.getFilteredPageEntities)).subscribe(value => {
        result = value;
      });

      store.dispatch(new fromActions.SaveAnnotationSuccess(anno));
      store.dispatch(new fromTags.AddFilterTags({important: true}));
      const expected = {
        '1': [anno]
      };

      expect(result).toEqual(expected);
    });
  });

  describe('getAllTagsArr', () => {
    it('should return filtered page annotations', () => {
      let result;
      store.pipe(select(fromSelectors.getAllTagsArr)).subscribe(value => {
        result = value;
      });

      store.dispatch(new fromActions.SaveAnnotationSuccess(anno));
      expect(result).toEqual([{ key: 'important', length: 1 }]);
    });
  });



});
