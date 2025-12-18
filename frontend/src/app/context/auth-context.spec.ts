import { TestBed } from '@angular/core/testing';

import { AuthContext } from './auth-context';

describe('AuthContext', () => {
  let service: AuthContext;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthContext);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
