import { TestBed } from '@angular/core/testing';

import { ProjectieService } from './projectie.service';

describe('ProjectieService', () => {
  let projectionService: ProjectieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ProjectieService],
    });
    projectionService = TestBed.inject(ProjectieService);
  });

  it('should be created', () => {
    const service: ProjectieService = TestBed.inject(ProjectieService);

    expect(service).toBeTruthy();
  });

  it('should return fixed extent', () => {
    const extent = projectionService.getProjectionExtent();

    expect(extent[0]).toEqual(-285401.92);
  });

  it('should return projection', () => {
    const projection = projectionService.getProjection();

    expect(projection.getCode()).toEqual('EPSG:28992');
  });
});
