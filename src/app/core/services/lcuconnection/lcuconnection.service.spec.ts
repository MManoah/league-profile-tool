import { TestBed } from '@angular/core/testing';

import { LCUConnectionService } from './lcuconnection.service';

describe('LCUConnectionService', () => {
  let service: LCUConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LCUConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
