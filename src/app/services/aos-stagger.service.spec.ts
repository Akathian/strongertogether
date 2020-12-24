import { TestBed } from '@angular/core/testing';

import { AosStaggerService } from './aos-stagger.service';

describe('AosStaggerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AosStaggerService = TestBed.get(AosStaggerService);
    expect(service).toBeTruthy();
  });
});
