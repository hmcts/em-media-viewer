import {Annotation} from '../annotations/annotation-set/annotation-view/annotation.model';
import { Bookmark } from '../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';
import * as moment_ from 'moment-timezone';

// @dynamic
export class StoreUtils {

  static groupByKeyEntities(annotations, key): {[id: string]: any[]} {
    return annotations.reduce((h, obj) =>
      Object.assign(h, { [obj[key]]:( h[obj[key]] || [] ).concat(obj) }), {});
  }

  static generateCommentsEntities(annotations): {[id: string]: Comment} {
     return annotations.reduce(
      (commentEntities: { [id: string]: Annotation }, annotation: Annotation) => {
        if (annotation.comments.length) {
          const comment = {
            ...annotation.comments[0] || '',
            tags: [...annotation.tags || []]
          }
          return {
            ...commentEntities,
            [annotation.id]: comment
          };
        }
        return {
          ...commentEntities
        };
      }, {});
  }

  static genTagNameEntities(annotations) {
    const filterAnnoWithoutCommentsTags = annotations.filter(a => (a.comments.length && a.tags.length));
    const allTags = filterAnnoWithoutCommentsTags.map(anno => this.groupByKeyEntities(anno.tags, 'name'));
    const groupedByName = allTags.reduce(
      (tagEntitiy: { [id: string]: Annotation }, tagItem) => {
        return {
          ...tagEntitiy,
          ...tagItem
        };
      }, {});

    return this.genNameEnt(annotations, groupedByName);
  };

  static genNameEnt(annos, groupedByName) {
     return Object.keys(groupedByName).reduce(
      (tagNameEnt, key) => {
        const readyAnno = annos.filter(anno => anno.tags.find(tag => tag.name === key))
          .map(anno => anno.id)
          .reduce((obj: {[id: string]: string}, anno: string) => ({ ...obj, [anno]: anno }), {});

        return {
          ...tagNameEnt,
          [key]: readyAnno
        }
      }, {});

  }

  static generateAnnotationEntities(anno): {[id: string]: Annotation} {
    return anno.reduce(
      (annoEntities: { [id: string]: Annotation }, annotation: Annotation) => {
        const annot = {
          ...annotation,
          positionTop: annotation.rectangles[0].y // todo remove this
        };
        return {
          ...annoEntities,
          [annotation.id]: annot
        };
      }, {});
  }

  static generateRedactionEntities(redactions): {[id: string]: Annotation} {
    return redactions.reduce(
      (annoEntities: { [id: string]: Annotation }, redaction: Annotation) => {
        return {
          ...annoEntities,
          [redaction.redactionId]: redaction
        };
      }, {});
  }


  static resetCommentEntSelect(ent) {
    return Object.keys(ent).reduce((object, key) => {
      object[key] = {
        ...ent[key],
        editable: false,
        selected: false
      };
      return object;
    }, {});
  }

  static generateBookmarkEntities(bookmarks: Bookmark[]): {[id: string]: Bookmark} {
    return bookmarks.reduce(
      (bookmarkEntities, bookmark) =>
        Object.assign(bookmarkEntities, { [bookmark.id]: bookmark }),
      {});
  }

  static filterCommentsSummary(comments, filters) {
    if(Object.keys(filters).length) {
      const tagFilterApplied = Object.keys(filters.tagFilters)
        .filter(key => filters.tagFilters[key] === true).length;
      const dateFilterApplied = (filters.dateRangeFrom || filters.dateRangeTo);
      const filteredComments = comments.filter(comment => {
        let hasTagFilter = false;
        let hasDateFilter = false;
        // check tags
        if (filters.hasOwnProperty('tagFilters')) {
          Object.keys(filters.tagFilters).forEach(filter => {
            const label = filters.tagFilters[filter];
            if (label) {
              return comment.tags.forEach(tag => {
                if (tag.name === filter && !hasTagFilter) {
                  hasTagFilter = true;
                }
              });
            }});
        }
        // check for dates
        if (dateFilterApplied) {
          const moment = moment_;
          const commentDate = moment(comment.lastModifiedDate);
          const dateFrom =  filters.dateRangeFrom !== null ? moment(filters.dateRangeFrom) : undefined;
          const dateTo = filters.dateRangeTo !== null ? moment(filters.dateRangeTo) : undefined;

          if (dateTo && dateFrom) {
            if (commentDate > dateFrom && commentDate < dateTo) {
              hasDateFilter = true;
            }
          }
          if (dateTo && !dateFrom) {
            if (commentDate <= dateTo) {
              hasDateFilter = true;
            }
          }
          if (dateFrom && !dateTo) {
            if (commentDate > dateFrom) {
              hasDateFilter = true;
            }
          }
        }
        return (hasTagFilter || hasDateFilter);
      });
      return (tagFilterApplied || dateFilterApplied) ? filteredComments : comments;
    } else {
      return comments;
    }
  }
}
