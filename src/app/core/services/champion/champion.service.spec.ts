import { TestBed } from '@angular/core/testing';

import { ChampionService } from './champion.service';

describe('ChampionService', () => {
  let service: ChampionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChampionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
