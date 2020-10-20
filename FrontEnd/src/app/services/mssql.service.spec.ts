import { TestBed } from '@angular/core/testing';

import { MSSQLService } from './mssql.service';

describe('MSSQLService', () => {
  let service: MSSQLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MSSQLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
