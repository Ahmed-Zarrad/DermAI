import { TestBed } from '@angular/core/testing';

import { AuthorizedoctorguardService } from './authorizedoctorguard.service';

describe('AuthorizeclientguardService', () => {
  let service: AuthorizedoctorguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizedoctorguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
