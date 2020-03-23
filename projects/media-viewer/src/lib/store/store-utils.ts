import {Annotation} from '../annotations/annotation-set/annotation-view/annotation.model';
// @dynamic
export class StoreUtils {

  static generatePageEntities(annotations): {[id: string]: Annotation[]} {
    return annotations.reduce((h, obj) =>
      Object.assign(h, { [obj.page]:( h[obj.page] || [] ).concat(obj) }), {});
  }

  static generateCommentsEntities(annotations): {[id: string]: Annotation[]} {
     return annotations.reduce(
      (commentEntities: { [id: string]: Annotation }, annotation: Annotation) => {
        if (annotation.comments.length) {
          const comment = {
            ...annotation.comments[0]

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


}
