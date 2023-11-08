import { TestBed } from '@angular/core/testing';

import { AuthorizepatientguardService } from './authorizepatientguard.service';

describe('AuthorizeclientguardService', () => {
  let service: AuthorizepatientguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizepatientguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
