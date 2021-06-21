import { TestBed } from '@angular/core/testing';

import { FinalReportService } from './final-report.service';

describe('FinalReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FinalReportService = TestBed.get(FinalReportService);
    expect(service).toBeTruthy();
  });
});
