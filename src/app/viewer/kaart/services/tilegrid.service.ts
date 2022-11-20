import { Injectable } from '@angular/core';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import TileGrid from 'ol/tilegrid/TileGrid';
import { Extent, getTopLeft } from 'ol/extent';
import { ProjectieService } from './projectie.service';

@Injectable({
  providedIn: 'root',
})
export class TilegridService {
  private resolutions = [
    3440.64, 1720.32, 860.169, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42, 0.21, 0.105,
    0.0525,
  ];

  private matrixIds = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];

  constructor(private projectionService: ProjectieService) {}

  public getResolution(zoomlevel: number): number {
    return this.resolutions[zoomlevel];
  }

  public getResolutions(): number[] {
    return this.resolutions;
  }

  public getTileGrid(tileGridType: string, maxResolution: number): TileGrid {
    if (tileGridType === 'WMTS') {
      return new WMTSTileGrid({
        extent: this.projectionService.getProjectionExtent() as Extent,
        resolutions: this.resolutions,
        matrixIds: this.matrixIds,
      });
    }
    if (tileGridType === 'MVT') {
      return new TileGrid({
        extent: this.projectionService.getProjectionExtent() as Extent,
        resolutions: this.resolutions.slice(0, maxResolution + 1),
        tileSize: [256, 256],
        origin: getTopLeft(this.projectionService.getProjectionExtent() as Extent),
      });
    }
    return undefined;
  }
}
