import { TestBed } from '@angular/core/testing';

import { ViewerUtilService } from './viewer-util.service';

describe('ViewerUtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewerUtilService = TestBed.get(ViewerUtilService);
    expect(service).toBeTruthy();
  });
});
