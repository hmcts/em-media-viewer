import { Bookmark } from '../viewers/pdf-viewer/side-bar/bookmarks/bookmarks.interfaces';

  export const generateBookmarkEntities = (bookmarks: Bookmark[]): {[id: string]: Bookmark} => {
    return bookmarks.reduce(
      (bookmarkEntities, bookmark) =>
        Object.assign(bookmarkEntities, { [bookmark.id]: bookmark }),
      {});
  }

  export const generateBookmarkNodes = (entities: { [id: string]: Bookmark }) => {
    const bookmarkEntities = JSON.parse(JSON.stringify(entities));
    indexEntities(bookmarkEntities);
    return Object.keys(bookmarkEntities).reduce((nodes, bookmarkId) => {
      const bookmarkEntity = bookmarkEntities[bookmarkId];
      if (bookmarkEntity.parent) {
        const parentEntity = bookmarkEntities[bookmarkEntity.parent];
        if (!parentEntity.children) {
          parentEntity.children = [];
        }
        parentEntity.children[bookmarkEntity.index] = bookmarkEntity;
      } else {
        nodes[bookmarkEntity.index] = bookmarkEntity;
      }
      return nodes;
    }, []);
  }

  const indexEntities = (entities: { [id: string]: Bookmark }) => {
    const entityIds = Object.keys(entities);
    for (let index = 0; entityIds.length > 0; index++) {
      let keysToRemove = [];
      entityIds.forEach(key => {
        if (!entities[key].previous || !entityIds.includes(entities[key].previous.toString())) {
          entities[key].index = index;
          keysToRemove.push(key);
        }
      });
      keysToRemove.forEach(key => entityIds.splice(entityIds.indexOf(key), 1));
      keysToRemove = [];
    }
  }

  export const getAllChildren = (bookmarks:Bookmark[]) => {
    if (bookmarks) {
      return bookmarks.reduce((childIds, bookmark) => {
        if (bookmark.children && bookmark.children.length > 0) {
          return [...childIds, bookmark.id, ...getAllChildren(bookmark.children)]
        }
        return [...childIds, bookmark.id]
      }, []);
    } else {
      return []
    }
  }
