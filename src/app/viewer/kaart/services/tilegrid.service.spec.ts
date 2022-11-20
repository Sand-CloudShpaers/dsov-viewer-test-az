import { TestBed } from '@angular/core/testing';
import TileGrid from 'ol/tilegrid/TileGrid';
import { TilegridService } from './tilegrid.service';

describe('TilegridService', () => {
  let tilegridService: TilegridService;
  const MIN_RESOLTUTION = 256;
  const MAX_RESOLTUION = 3440.64;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TilegridService],
    });
    tilegridService = TestBed.inject(TilegridService);
  });

  it('should be created', () => {
    expect(tilegridService).toBeTruthy();
  });

  it('should return OlTilegrid', () => {
    const wmtsTileGrid = tilegridService.getTileGrid('WMTS', MAX_RESOLTUION);
    const tmsTileGrid = tilegridService.getTileGrid('TMS', MAX_RESOLTUION);

    expect(wmtsTileGrid instanceof TileGrid).toBeTruthy();
    expect(wmtsTileGrid.getTileSize(0)).toEqual(MIN_RESOLTUTION);
    expect(tmsTileGrid).toBeUndefined();
  });
});
