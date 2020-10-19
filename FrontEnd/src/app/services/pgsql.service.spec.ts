import { TestBed } from '@angular/core/testing';

import { PGSQLService } from './pgsql.service';

describe('PGSQLService', () => {
  let service: PGSQLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PGSQLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
