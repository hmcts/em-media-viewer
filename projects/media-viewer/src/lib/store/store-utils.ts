import {Annotation} from '../annotations/annotation-set/annotation-view/annotation.model';

export class StoreUtils {

  static generatePageEntities(annotations): {[id: string]: Annotation[]} {
    return annotations.reduce((h, obj) =>
      Object.assign(h, { [obj.page]:( h[obj.page] || [] ).concat(obj) }), {});
  }

  static generateCommentsEntities(annotations): {[id: string]: Annotation[]} {
     return annotations.reduce(
      (commentEntities: { [id: string]: Annotation }, annotation: Annotation) => {
        console.log(annotation)
        if (annotation.comments.length) {
          const comment = {
            ...annotation.comments[0],

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

  static generateAnnotationEntities(annotation): {[id: string]: Annotation[]} {
    return annotation.reduce(
      (annoEntities: { [id: string]: Annotation }, annotation: Annotation) => {
        const anno = {
          page: annotation.page,
          positionTop: annotation.rectangles[0].y
        }
        return {
          ...annoEntities,
          [annotation.id]: anno
        };
      }, {});
  }

}
