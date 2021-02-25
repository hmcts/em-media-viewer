import { generateBookmarkEntities, generateBookmarkNodes, getBookmarkChildren } from './bookmarks-store-utils';

describe('bookmarks-store-utils', () => {

  const bookmark1 = {
    name: 'bookmark 1', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id1'
  } as any;
  const bookmark2 = { ...bookmark1, name: 'bookmark 2',  id: 'id2', previous: 'id1' } as any;

  it('should generate bookmark entities', function () {
    const bookmarkEntities = generateBookmarkEntities([bookmark1, bookmark2]) as any;

    expect(bookmarkEntities).toEqual({ id1: bookmark1, id2: bookmark2 });
  });

  it('should generate bookmark nodes', function () {
    const bookmark3 = { ...bookmark1, parent: 'id1', id: 'id3', name: 'bookmark 3' };
    const parent = { ...bookmark1, children: [ { ...bookmark3, index: 0 } ]};
    const bookmarkNodes = generateBookmarkNodes({ id1: bookmark1, id2: bookmark2, id3: bookmark3 });

    expect(bookmarkNodes).toEqual([{ ...parent, index: 0 }, { ...bookmark2, index: 1 }]);
  });

  it('should get bookmark children', function () {
    const bookmark3 = { ...bookmark1, parent: 'id2', id: 'id3', name: 'bookmark 3' };
    const parent = { ...bookmark2, previous: undefined, parent: 'id1', children: [bookmark3]};
    const grandparent = { ...bookmark1, children: [ parent ]};

    const children = getBookmarkChildren(grandparent.children);

    expect(children).toEqual(['id2', 'id3']);
  });

});
