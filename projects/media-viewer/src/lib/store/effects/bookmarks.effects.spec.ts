import { BookmarksEffects } from './bookmarks.effects';
import { LoadBookmarksSuccess } from '../actions/bookmarks.action';
import { Actions } from '@ngrx/effects';

describe('BookmarksEffects', () => {

  let effects: BookmarksEffects;
  const mockActions = {} as any;
  const mockApiService = {} as any;

  it('should trigger load bookmarks success', function () {
    effects = new BookmarksEffects(new Actions<LoadBookmarksSuccess>(), mockApiService);

  });

  it('should trigger load bookmarks failure', function () {

  });

  it('should trigger create bookmarks success', function () {

  });

  it('should trigger create bookmarks failure', function () {

  });

  it('should trigger delete bookmarks success', function () {

  });

  it('should trigger delete bookmarks failure', function () {

  });
});
