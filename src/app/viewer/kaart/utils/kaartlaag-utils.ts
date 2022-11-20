import { Feature, Map } from 'ol';
import LayerGroup from 'ol/layer/Group';
import { Geometry, GeometryCollection } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';

export class KaartlaagUtils {
  public static getFeaturesById(laag: VectorLayer<VectorSource<Geometry>>, elementId: string): Feature<Geometry>[] {
    if (!laag || !elementId) {
      return [];
    }

    return laag
      .getSource()
      .getFeatures()
      .filter(feature => feature.getProperties()['elementId'] === elementId);
  }

  public static getLayerByIdFromMap(map: Map, laagId: string): BaseLayer {
    let layer = null;
    if (!map || !laagId) {
      return null;
    }
    map.getLayers().forEach(olBaseLayer => {
      if (olBaseLayer.getProperties()['id'] === laagId) {
        layer = olBaseLayer;
      }
    });
    return layer;
  }

  public static getLayersByGroupNameFromMap(map: Map, groupName: string): BaseLayer[] {
    const layers: BaseLayer[] = [];

    map.getLayers().forEach(olBaseLayer => {
      if (olBaseLayer instanceof TileLayer && olBaseLayer.getProperties()['groupName'] === groupName) {
        layers.push(olBaseLayer);
      }
    });

    return layers;
  }

  public static getLayerByIdFromLayerGroup(group: LayerGroup, laagId: string): BaseLayer {
    let layer = null;
    if (!group || !laagId) {
      return null;
    }
    group.getLayers().forEach(olBaseLayer => {
      if (olBaseLayer.getProperties()['laagId'] === laagId) {
        layer = olBaseLayer;
      }
    });
    return layer;
  }

  public static createVectorLayerWithGeometries(geometries: Geometry[]): VectorLayer<VectorSource<Geometry>> {
    const feature = new Feature(new GeometryCollection(geometries));
    const source = new VectorSource();
    source.addFeature(feature);
    return new VectorLayer({ source });
  }

  public static isBestemmingsPlanAchtigeByType(
    planType: string,
    beleidsmatigVerantwoordelijkeOverheidType?: string
  ): boolean {
    return (
      [
        'bestemmingsplan',
        'inpassingsplan',
        'uitwerkingsplan',
        'wijzigingsplan',
        'aanwijzingsbesluit',
        'beheersverordening',
        'exploitatieplan',
        'gerechtelijke uitspraak',
        'omgevingsvergunning',
        'projectbesluit',
        'reactieve aanwijzing',
        'tijdelijke ontheffing buitenplans',
        'voorbereidingsbesluit',
        'gemeentelijk plan; bestemmingsplan artikel 10',
        'gemeentelijk plan; uitwerkingsplan artikel 11',
        'gemeentelijk plan; voorbereidingsbesluit',
        'gemeentelijk plan; wijzigingsplan artikel 11',
        'gemeentelijke visie; overig',
      ].includes(planType.toLowerCase()) ||
      (planType.toLowerCase() === 'structuurvisie' &&
        (beleidsmatigVerantwoordelijkeOverheidType === 'gemeentelijke overheid' ||
          beleidsmatigVerantwoordelijkeOverheidType === 'gemeente'))
    );
  }
}
