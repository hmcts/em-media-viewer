import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  let pipe: FilterPipe;

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  it('should return empty array', () => {
    const expected = pipe.transform(undefined, 'searchText', 'searchField');

    expect(expected).toEqual([]);
  });

  it('should return all items', () => {
    const searchList = ['item 1', 'item 2', 'item 3'];
    const expected = pipe.transform(searchList, undefined, 'searchField');

    expect(expected).toEqual(searchList);
  });

  it('should return matching items', () => {
    const searchList = [{ searchField: 'match 1'}, undefined, 'match 2', 'item 3'];
    const expected = pipe.transform(searchList, 'match', 'searchField');

    expect(expected).toEqual([{ searchField: 'match 1'}, 'match 2']);
  });
});
