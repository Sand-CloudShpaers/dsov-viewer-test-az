import WMTSTileGrid from 'ol/tilegrid/WMTS';
import BaseLayer from 'ol/layer/Base';
import VectorTileLayer from 'ol/layer/VectorTile';
import TileLayer from 'ol/layer/Tile';
import { ImageWMS, VectorTile, WMTS } from 'ol/source';
import ImageLayer from 'ol/layer/Image';
import MVT from 'ol/format/MVT';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KaartlaagConfiguratie, LayerConfigFormat, ServiceTypes } from '../types/kaartlaag-configuratie';
import { TilegridService } from './tilegrid.service';
import { ProjectieService } from './projectie.service';
import { NoCacheHeaders } from '~services/no-cache-headers';

const MAX_RESOLUTION = 16;

@Injectable({
  providedIn: 'root',
})
export class KaartlaagFactoryService {
  public layerConfigFormat: LayerConfigFormat;

  constructor(
    private http: HttpClient,
    private tileGridService: TilegridService,
    private projectionService: ProjectieService
  ) {}

  public load(): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      this.http
        .get<LayerConfigFormat>('config/kaart/kaartlagen.json', {
          headers: NoCacheHeaders,
        })
        .subscribe(response => {
          this.layerConfigFormat = response;
          resolve(true);
        });
    });
  }

  public initializeLayer(layerConfig: KaartlaagConfiguratie, laagId?: string): BaseLayer {
    let serviceLayer: BaseLayer;
    switch (layerConfig.type) {
      case ServiceTypes.MVT: {
        let laagUrl: string;
        if (laagId) {
          laagUrl = layerConfig.serviceUrl + laagId + '/tiles/{z}/{x}/{y}.' + layerConfig.tileformat;
        } else {
          laagUrl = layerConfig.serviceUrl + '/{z}/{x}/{y}.' + layerConfig.tileformat;
        }
        serviceLayer = new VectorTileLayer({
          source: this.getVectorTileSource(laagUrl, layerConfig.maxResolution),
          visible: layerConfig.initialVisible,
          opacity: layerConfig.initialOpacity,
          renderMode: 'hybrid',
          declutter: layerConfig.declutter,
        });
        serviceLayer.setProperties({ baseUrl: layerConfig.serviceUrl });
        serviceLayer.setProperties({ type: ServiceTypes.MVT });
        if (laagId) {
          serviceLayer.setProperties({ laagId });
        }
        break;
      }
      case ServiceTypes.WMTS: {
        const wmtsConfigObject = {
          url: layerConfig.serviceUrl,
          format: 'image/png',
          projection: 'EPSG:28992',
          tileGrid: this.tileGridService.getTileGrid('WMTS', MAX_RESOLUTION) as WMTSTileGrid,
          style: 'default',
        };
        const wmtsConfig = { ...wmtsConfigObject, ...layerConfig.serviceParameters };
        serviceLayer = new TileLayer({
          source: new WMTS(wmtsConfig),
          visible: layerConfig.initialVisible,
          opacity: !layerConfig.initialOpacity ? 1 : layerConfig.initialOpacity,
          minResolution: layerConfig.minResolution,
          maxResolution: layerConfig.maxResolution,
          zIndex: layerConfig.zIndex,
        });
        serviceLayer.set('groupName', layerConfig.groupName);
        break;
      }
      case ServiceTypes.WMS: {
        const wmsConfigObject = {
          url: layerConfig.serviceUrl,
          params: {
            LAYERS: layerConfig.serviceParameters.layer,
          },
          format: 'image/png',
          projection: 'EPSG:28992',
          version: '1.0.3',
        };
        const wmsConfig = { ...wmsConfigObject, ...layerConfig.serviceParameters };
        serviceLayer = new ImageLayer({
          source: new ImageWMS(wmsConfig),
          visible: layerConfig.initialVisible,
          opacity: !layerConfig.initialOpacity ? 1 : layerConfig.initialOpacity,
          maxResolution: layerConfig.maxResolution,
          zIndex: layerConfig.zIndex,
        });
        break;
      }
      default:
    }
    serviceLayer.setProperties({
      id: layerConfig.id,
      title: layerConfig.layercontrol?.title,
      icon: layerConfig.layercontrol?.icon,
    });
    return serviceLayer;
  }

  public getVectorTileSource(tileEndpoint: string, maxResolution: number): VectorTile {
    return new VectorTile({
      format: new MVT(),
      tileGrid: this.tileGridService.getTileGrid('MVT', maxResolution),
      projection: this.projectionService.getProjection(),
      // tilePixelRatio: 16,
      url: tileEndpoint,
      // renderBuffer: 10,
    });
  }
}
