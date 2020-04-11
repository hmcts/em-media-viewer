import { BookmarksApiService } from './bookmarks-api.service';

describe('BookmarksApiService', () => {

  let service: BookmarksApiService

  const mockHttpClient = {} as any;

  beforeEach(() => {
    service = new BookmarksApiService(mockHttpClient);
  });

  it('should get bookmarks', function () {

  });

  it('should create bookmark', function () {

  });

  it('should update bookmark', function () {

  });

  it('should delete bookmark', function () {

  });
});
