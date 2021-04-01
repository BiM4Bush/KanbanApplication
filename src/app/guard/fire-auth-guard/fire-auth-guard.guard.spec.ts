import { TestBed } from '@angular/core/testing';
import { FireAuthGuardGuard } from './fire-auth-guard.guard';

describe('FireAuthGuardGuard', () => {
  let guard: FireAuthGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FireAuthGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
