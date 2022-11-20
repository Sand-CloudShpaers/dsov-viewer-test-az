import { Injectable } from '@angular/core';
import BaseLayer from 'ol/layer/Base';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Geometry, MultiPolygon, Point, Polygon } from 'ol/geom';
import { Style } from 'ol/style';
import { Extent } from 'ol/extent';
import { OlStylesConfig } from '~viewer/kaart/types/ol-styles.config';
import { GeoUtils } from '~general/utils/geo.utils';
import { zIndices } from '~viewer/kaart/services/kaart.service';
import { LocatieFilter } from '~viewer/filter/types/filter-options';
import { Fill, Stroke, Text } from 'ol/style';

@Injectable({
  providedIn: 'root',
})
export class ZoeklocatielaagService {
  private zoeklocatielaag: VectorLayer<VectorSource<Geometry>>;
  private currentZoekGeometrie: Geometry;
  private labelPoint: Feature<Geometry>;

  public initializeZoeklocatielaag(): BaseLayer {
    this.zoeklocatielaag = null;
    const source = new VectorSource();
    this.zoeklocatielaag = new VectorLayer({
      zIndex: zIndices.ZoekgebiedLaag,
      source,
    });
    this.zoeklocatielaag.setProperties({ id: 'zoeklocatie' });
    return this.zoeklocatielaag;
  }

  public getFeatures(): Feature<Geometry>[] {
    return this.zoeklocatielaag.getSource().getFeatures();
  }

  public removeFeatures(): void {
    this.zoeklocatielaag.getSource().clear();
  }

  public addZoeklocatie(geometry: Geometry): Feature<Geometry> {
    this.currentZoekGeometrie = geometry;
    return geometry.getType() !== 'GeometryCollection'
      ? this.addZoekGeometry(geometry)
      : this.addZoekGeometry(new Polygon(GeoUtils.getCoordinatesFromOlGeometry(geometry) as number[]));
  }

  public addLabel(location: LocatieFilter): void {
    // Label moet boven gebied staan, dus label punt aan bovenkant/centrum bbox
    this.labelPoint = new Feature();
    const style = new Style();
    style.setText(
      new Text({
        offsetY: location.geometry instanceof Point ? -50 : -15,
        font: 'bold 16px ASAP,sans-serif',
        fill: new Fill({ color: 'rgba(139, 74, 106, 1)' }),
        backgroundFill: new Fill({ color: 'rgba(255, 255, 255, 1)' }),
        backgroundStroke: new Stroke({
          lineJoin: 'round',
          color: 'rgba(255, 255, 255, 1)',
          width: 7,
        }),
        text: location.name.toString(),
      })
    );
    this.labelPoint.setStyle(style);
    this.zoeklocatielaag.getSource().addFeature(this.labelPoint);
  }

  public plaatsZoekgebiedLabel(mapExtent: Extent): void {
    if (this.currentZoekGeometrie && this.labelPoint) {
      // bereken de extent van het zichtbare deel van het zoekgebied, en plaats het label adhv deze extent
      const extent = GeoUtils.intersectionWithExtent(this.currentZoekGeometrie, mapExtent).getExtent();
      this.labelPoint.setGeometry(new Point([extent[0] + (extent[2] - extent[0]) / 2, extent[3]]));
    }
  }

  private addZoekGeometry(geometry: Geometry): Feature<Geometry> {
    const feature: Feature<Geometry> = new Feature(geometry);
    if (geometry instanceof Point) {
      this.zoeklocatielaag.setStyle(OlStylesConfig.ZOEK_LOCATIE_MARKER);
    } else {
      this.zoeklocatielaag.setStyle(OlStylesConfig.ZOEK_LOCATIE);
    }
    if (geometry instanceof Polygon || geometry instanceof MultiPolygon) {
      this.zoeklocatielaag.getSource().addFeature(new Feature(GeoUtils.getInverseGeometries([geometry])));
    } else {
      this.zoeklocatielaag.getSource().addFeature(feature);
    }
    return feature;
  }
}
