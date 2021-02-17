import { Comment } from '../annotations/comment-set/comment/comment.model';
import { StoreUtils } from './store-utils';

describe('StoreUtils', () => {

  describe('groupByKeyEntities', () => {
    it('should group entities by key', () => {
      const mockAnnotations = [
        { page: 1, annotationId: '123' },
        { page: 1, annotationId: '234' },
        { page: 3, annotationId: '456' }
      ];
      expect(StoreUtils.groupByKeyEntities(mockAnnotations, 'page')).toEqual({
        1: [
          { page: 1, annotationId: '123' },
          { page: 1, annotationId: '234' },
        ],
        3: [{ page: 3, annotationId: '456' }]
      });
    });
  });

  describe('resetCommentEntSelect', () => {
    it('should reset comment entity select and editable props', () => {
      const mockEntity = {
        annotationId: '123',
        content: 'comment',
        tags: [],
        page: 1,
        pages: {},
        pageHeight: 200,
        selected: true,
        editable: true,
        id: '111',
        createdBy: null,
        createdByDetails: null,
        createdDate: null,
        lastModifiedBy: null,
        lastModifiedByDetails: null,
        lastModifiedDate: null
      };

      expect(StoreUtils.resetCommentEntSelect({ '123': mockEntity })).toEqual({
        '123': {
          ...mockEntity,
          selected: false,
          editable: false
        }
      });
    });
  });

  describe('filterCommentsSummary', () => {
    const mockComments: Array<Comment> = [
      {
        annotationId: '123',
        content: 'test text',
        tags: [{ name: 'Tag1', label: 'Tag one'}],
        page: 1,
        pages: {},
        pageHeight: 200,
        selected: true,
        editable: false,
        id: '123',
        createdBy: 'user1',
        createdByDetails: null,
        createdDate: '2021-01-03T10:00:00Z',
        lastModifiedBy: null,
        lastModifiedByDetails: null,
        lastModifiedDate: '2021-01-03T10:00:00Z'
      },
      {
        annotationId: '234',
        content: 'Test comment',
        tags: [{ name: 'Tag2', label: 'Tag two'}],
        page: 2,
        pages: {},
        pageHeight: 200,
        selected: true,
        editable: false,
        id: '234',
        createdBy: 'user1',
        createdByDetails: null,
        createdDate: '2021-01-04T10:00:00Z',
        lastModifiedBy: null,
        lastModifiedByDetails: null,
        lastModifiedDate: '2021-01-04T10:00:00Z'
      }
    ];

    it('should return original array if filers are no set', () => {
      expect(StoreUtils.filterCommentsSummary(mockComments, {})).toEqual(mockComments);
    });

    it('should return filtered array by tag filter', () => {
      const result = StoreUtils.filterCommentsSummary(mockComments, { tagFilters: { 'Tag1': true } });
      expect(result).toEqual([mockComments[0]]);
    });

    it('should return filtered array by date from filter', () => {
      const result = StoreUtils.filterCommentsSummary(mockComments, {
        tagFilters: {},
        dateRangeFrom: new Date('2021-01-03T00:00:00Z').getTime(),
        dateRangeTo: null
      });
      expect(result).toEqual(mockComments);
    });

    it('should return filtered array by date to filter', () => {
      const result = StoreUtils.filterCommentsSummary(mockComments, {
        tagFilters: {},
        dateRangeTo: new Date('2021-01-04T00:00:00Z').getTime(),
        dateRangeFrom: null
      });
      expect(result).toEqual([mockComments[0]]);
    });

    it('should return filtered array by date to and from filters', () => {
      const result = StoreUtils.filterCommentsSummary(mockComments, {
        tagFilters: {},
        dateRangeFrom: new Date('2021-01-03T12:00:00Z').getTime(),
        dateRangeTo: new Date('2021-01-05T10:00:00Z').getTime()
      });
      expect(result).toEqual([mockComments[1]]);
    });
  });
});
