import { TestBed } from '@angular/core/testing';

import { SkinResultsService } from './skin-results.service';

describe('SkinResultsService', () => {
  let service: SkinResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkinResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
