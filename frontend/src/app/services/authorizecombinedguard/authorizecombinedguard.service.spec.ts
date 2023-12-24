import { TestBed } from '@angular/core/testing';

import { AuthorizecombinedguardService } from './authorizecombinedguard.service';

describe('AuthorizecombinedguardService', () => {
  let service: AuthorizecombinedguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizecombinedguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
