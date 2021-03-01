import { TestBed,  } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TagsServices } from '../../services/tags/tags.services';

const mockTags = [{ name: 'tag1', label: 'Tag 1'}];

describe('TagsService', () => {
  let httpMock: HttpTestingController;
  let tagsService: TagsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        TagsServices
      ],
    });

    httpMock = TestBed.get(HttpTestingController);
    tagsService = TestBed.get(TagsServices);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch data from the API', () => {
    const mockUserId = 'user123';

    tagsService.getAllTags(mockUserId).subscribe(data => {
      expect(data).toEqual(mockTags);
    });

    const req = httpMock.expectOne(`/em-anno/tags/${mockUserId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTags);
  });

  describe('getNewTags', () => {
    it('should return a tags array', () => {
      tagsService.tagItems = {
        123: [...mockTags]
      };

      expect(tagsService.getNewTags('123')).toEqual(mockTags);
    });

    it('should return an empty array', () => {
      expect(tagsService.getNewTags('321')).toEqual([]);
    });
  });

  it('should have updateTagItems', () => {
    const mockItems = [{ name: 'This should be a snake cased', label: 'One' }];
    tagsService.updateTagItems(mockItems, '111');

    expect(tagsService.tagItems['111']).toEqual([{ name: 'this_should_be_a_snake_cased', label: 'One' }]);
  });
});
