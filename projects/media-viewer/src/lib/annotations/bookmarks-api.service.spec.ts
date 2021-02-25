import { BookmarksApiService } from './bookmarks-api.service';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('BookmarksApiService', () => {

  let service: BookmarksApiService;
  let mockHttpClient: HttpTestingController;

  const bookmark = {
    name: 'bookmark', xCoordinate: 100, yCoordinate: 50, documentId: 'documentId', id: 'id', pageNumber: 1, zoom: 1
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookmarksApiService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(BookmarksApiService);
    mockHttpClient = TestBed.get(HttpTestingController);
  });

  it('should get bookmarks', fakeAsync((done) => {
    service.getBookmarks('documentId').subscribe((resp) => {
      expect(resp.body).toEqual([bookmark]);
    }, error => done(error));

    const request = mockHttpClient.expectOne(req => req.url.endsWith('/documentId/bookmarks'));
    expect(request.request.method).toBe('GET');
    request.flush([bookmark]);
  }));

  it('should create bookmark', fakeAsync((done) => {
    service.createBookmark(bookmark).subscribe((resp) => {
      expect(resp).toEqual(bookmark);
    }, error => done(error));

    const request = mockHttpClient.expectOne(req => req.url.endsWith('/bookmarks'));
    expect(request.request.method).toBe('POST');
    request.flush(bookmark);
  }));

  it('should update bookmark', fakeAsync((done) => {
    service.updateBookmark(bookmark).subscribe((resp) => {
      expect(resp).toEqual(bookmark);
    }, error => done(error));

    const request = mockHttpClient.expectOne(req => req.url.endsWith('/bookmarks'));
    expect(request.request.method).toBe('PUT');
    request.flush(bookmark);
  }));

  it('should delete bookmark', fakeAsync((done) => {
    service.deleteBookmark('bookmarkId').subscribe((resp) => {
      expect(resp).toEqual(null);
    }, error => done(error));

    const request = mockHttpClient.expectOne(req => req.url.endsWith('/bookmarks/bookmarkId'));
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  }));

  it('should update multiple bookmarks', fakeAsync((done) => {
    service.updateMultipleBookmarks([bookmark]).subscribe((resp) => {
      expect(resp).toEqual([bookmark]);
    }, error => done(error));

    const request = mockHttpClient.expectOne(req => req.url.endsWith('/bookmarks_multiple'));
    expect(request.request.method).toBe('PUT');
    request.flush([bookmark]);
  }));

  it('should delete multiple bookmarks', fakeAsync((done) => {
    service.deleteMultipleBookmarks({ deleted: ['bookmarkId'], updated: undefined })
      .subscribe((resp) => expect(resp).toEqual(null),
          error => done(error));

    const request = mockHttpClient.expectOne(req => req.url.endsWith('/bookmarks_multiple'));
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  }));
});
