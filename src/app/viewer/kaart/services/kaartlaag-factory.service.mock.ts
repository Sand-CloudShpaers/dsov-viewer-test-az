import { Injectable } from '@angular/core';
import BaseLayer from 'ol/layer/Base';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import TileGrid from 'ol/tilegrid/TileGrid';
import { Extent, getTopLeft } from 'ol/extent';
import Projection from 'ol/proj/Projection';
import { KaartlaagConfiguratie, LayerConfigFormat, ServiceTypes } from '~viewer/kaart/types/kaartlaag-configuratie';
import { KaartlaagFactoryService } from '~viewer/kaart/services/kaartlaag-factory.service';

@Injectable()
export class KaartlaagFactoryServiceMock extends KaartlaagFactoryService {
  public layerConfigFormat: LayerConfigFormat = {
    ruimtelijkeplannenlagen: {
      id: 'RPnlVT',
      initialVisible: false,
      serviceUrl: 'https://ihrvtservice',
      type: ServiceTypes.MVT,
    },
    omgevingsdocumentlagen: [
      {
        id: 'RPnlVT',
        initialVisible: false,
        serviceUrl: 'https://ozonvtservice',
        tileformat: 'pbf',
        type: ServiceTypes.MVT,
      },
    ],
    achtergrondlagen: [],
    informatielagen: [],
  };

  public load(): Promise<boolean> {
    return Promise.resolve(true);
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
          source: new VectorTileSource({
            format: new MVT(),
            tileGrid: new TileGrid({
              extent: [-285401.92, 22598.08, 595401.92, 903401.92] as Extent,
              resolutions: [
                3440.64, 1720.32, 860.169, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42,
                0.21,
              ],
              tileSize: [256, 256],
              origin: getTopLeft([-285401.92, 22598.08, 595401.92, 903401.92] as Extent),
            }),
            projection: new Projection({
              code: 'EPSG:28992',
              units: 'm',
              extent: [-285401.92, 22598.08, 595401.92, 903401.92] as Extent,
            }),
            // tilePixelRatio: 16,
            url: laagUrl,
            // renderBuffer: 10,
          }),
          visible: layerConfig.initialVisible,
          opacity: layerConfig.initialOpacity,
          renderMode: 'image',
        });
        serviceLayer.setProperties({ baseUrl: layerConfig.serviceUrl });
        serviceLayer.setProperties({ type: ServiceTypes.MVT });
        if (laagId) {
          serviceLayer.setProperties({ laagId });
        }
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
}
