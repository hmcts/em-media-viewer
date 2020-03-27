import {Annotation} from '../annotations/annotation-set/annotation-view/annotation.model';
// @dynamic
export class StoreUtils {

  static groupByKeyEntities(annotations, key): {[id: string]: Annotation[]} {
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

  // todo group this by name ['annoid']
  static genTagNameEntities(annotations) {
    const allTags = annotations.map(anno => this.groupByKeyEntities(anno.tags, 'name'));
    console.log(allTags)
    console.log(annotations)
    const groupedByName = allTags.reduce(
      (tagEntitiy: { [id: string]: Annotation }, tagItem) => {
        const tag = tagItem;
        return {
          ...tagEntitiy,
          ...tag
        };
      }, {});

    return this.genNameEnt(annotations, groupedByName)
  };

  static genNameEnt(annos, groupedByName) {
     return Object.keys(groupedByName).reduce(
      (tagNameEnt, key) => {
        const annot = annos.map(anno => {
          const tags = anno.tags.map(tag => {
            if (tag.name === key) {
              return anno.id;
            }
          });
          return tags.filter(a => a !== undefined);
        });
        return {
          ...tagNameEnt,
          [key]: [...annot].filter(a =>  !!a.length)
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

  static snakeCase = string => {
    // transform string_to_snake_case
    return string.replace(/\W+/g, " ")  // find space
      .split(/ |\B(?=[A-Z])/) // split it into array
      .map(word => word.toLowerCase()) // transform to lover case
      .join('_'); // trun array into sting using _
  };


}
