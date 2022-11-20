import { Router } from '@angular/router';
import { createServiceFactory, mockProvider, SpectatorService } from '@ngneat/spectator';
import { MapBrowserEvent } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import { Point } from 'ol/geom';
import { FeatureLike } from 'ol/Feature';
import LayerGroup from 'ol/layer/Group';
import BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { KaartService, zIndices } from '~viewer/kaart/services/kaart.service';
import { AchtergrondlagenService } from '~viewer/kaart/services/achtergrondlagen.service';
import { ProjectieService } from '~viewer/kaart/services/projectie.service';
import { TilegridService } from '~viewer/kaart/services/tilegrid.service';
import { DisableMapClickService } from '~viewer/kaart/services/disable-map-click.service';
import { InformatielagenService } from '~viewer/kaart/services/informatielagen.service';
import { OmgevingsdocumentlagenService } from '~viewer/kaart/services/omgevingsdocumentlagen.service';
import { ImroPlanlagenService } from '~viewer/kaart/services/imro-planlagen.service';
import { ZoeklocatielaagService } from '~viewer/kaart/services/zoeklocatielaag.service';
import { SearchLocationService } from '~services/search-location.service';

describe('KaartService', () => {
  let spectator: SpectatorService<KaartService>;
  const spyOnInitializeAchtergrondlagen = jasmine.createSpy('spyOnInitializeAchtergrondlagen').and.returnValue([]);
  const spyOnInitializeInformatielagen = jasmine.createSpy('spyOnInitializeInformatielagen').and.returnValue([]);
  const spyOnInitializeOmgevingsdocumentLaag = jasmine
    .createSpy('spyOnInitializeOmgevingsdocumentLaag')
    .and.returnValue(new BaseLayer({}));
  const spyOnInitializeOmgevingsdocumentTijdreisLaag = jasmine
    .createSpy('spyOnInitializeOmgevingsdocumentTijdreisLaag')
    .and.returnValue(new BaseLayer({}));
  const spyOnInitializeZoeklocatielaag = jasmine
    .createSpy('spyOnInitializeZoeklocatielaag')
    .and.returnValue(new BaseLayer({}));

  const createService = createServiceFactory({
    service: KaartService,
    providers: [
      mockProvider(AchtergrondlagenService, { initializeAchtergrondlagen: spyOnInitializeAchtergrondlagen }),
      mockProvider(InformatielagenService, { initializeInformatielagen: spyOnInitializeInformatielagen }),
      mockProvider(OmgevingsdocumentlagenService, {
        initDefault: spyOnInitializeOmgevingsdocumentLaag,
        initTimeTravel: spyOnInitializeOmgevingsdocumentTijdreisLaag,
      }),
      mockProvider(ImroPlanlagenService, {
        lagen: new LayerGroup(),
      }),
      mockProvider(ZoeklocatielaagService, { initializeZoeklocatielaag: spyOnInitializeZoeklocatielaag }),
      TilegridService,
      ProjectieService,
      DisableMapClickService,
      mockProvider(SearchLocationService),
      {
        provide: Router,
        useValue: {
          url: 'https://nietbelangrijk/viewer/document/NL.IMRO.doet.er.ook.niet.meer.toe',
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    spectator.service.initMap$();
  });

  afterEach(function () {});

  it('map should pan to coördinate', done => {
    const newCenter: Coordinate = [150000, 400000];
    spectator.service.panToCoordinate(newCenter);
    const oldCenter = spectator.service.getMap().getView().getCenter();
    setTimeout(function () {
      expect(spectator.service.getMap().getView().getCenter()).toEqual(newCenter);
      expect(spectator.service.getMap().getView().getCenter()).not.toEqual(oldCenter);
      done();
    }, 300);
  });

  it('map should zoom to extent', done => {
    const extent: Extent = [150000, 400000, 160000, 500000];
    spectator.service.zoomToExtent(extent);
    const oldResolution = spectator.service.getMap().getView().getResolution();
    setTimeout(function () {
      expect(spectator.service.getMap().getView().getCenter()).toEqual([155000, 450000]);
      expect(spectator.service.getMap().getView().getResolution()).not.toEqual(oldResolution);
      done();
    }, 1100);
  });

  it('should add/remove layer for pin', () => {
    const numberOfLayersOld = spectator.service.getMap().getLayers().getLength();
    spectator.service.addPin([150000, 400000]);
    const numberOfLayersNew = spectator.service.getMap().getLayers().getLength();
    const pinLaag: VectorLayer<VectorSource<any>> = spectator.service
      .getMap()
      .getLayers()
      .item(numberOfLayersNew - 1) as VectorLayer<VectorSource<any>>;
    const pinPunt: Point = pinLaag.getSource().getFeatures()[0].getGeometry() as Point;

    expect(spectator.service.getMap().getLayers().getLength()).toEqual(numberOfLayersOld + 1);
    expect(pinLaag.getZIndex()).toEqual(zIndices.CoordinateSearchPinLaag);
    expect(pinPunt.getType()).toEqual('Point');
    expect(pinPunt.getCoordinates()).toEqual([150000, 400000]);

    spectator.service.removePin();

    expect(spectator.service.getMap().getLayers().getLength()).toEqual(numberOfLayersNew - 1);
  });

  it('should dedupe Features', done => {
    // In sommige gevallen bevatten de features dubbelingen, dat zijn features met identieke properties
    // Deze worden er uit gehaald, zodat in de lijst van details op locatie geen duplicaten getoond worden.
    const featuresWithDuplicates = [
      {
        getProperties: () => ({
          type: 'Enkelbestemming',
          objectid: 'NL.IMRO.267f608c06a34620b2ba79c45b712d4f',
          naam: 'Wonen',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          categorie: 'Enkelbestemming',
          classificatie: 'wonen',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Bouwaanduiding',
          objectid: 'NL.IMRO.718591de864b4f4b9beb7069297188e6',
          naam: 'gestapeld',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Maatvoering',
          objectid: 'NL.IMRO.47c384e1328646a7bf2cfd794471d8f8',
          naam: 'maximum goothoogte (m), maximum bouwhoogte (m)',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Bouwvlak',
          objectid: 'NL.IMRO.09ce6efd5e3e4752bffe0493074a6a03',
          naam: 'bouwvlak',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Functieaanduiding',
          objectid: 'NL.IMRO.0860f60156cf492f8e63eea3c75ffae5',
          naam: 'zorgwoning',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Gebiedsaanduiding',
          objectid: 'NL.IMRO.fb63cc184f6944938ebcab2406819bf0',
          naam: 'overige zone - specifieke archeologische waarden',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          categorie: 'Gebiedsaanduiding',
          classificatie: 'overige zone',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Enkelbestemming',
          objectid: 'NL.IMRO.267f608c06a34620b2ba79c45b712d4f',
          naam: 'Wonen',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          categorie: 'Enkelbestemming',
          classificatie: 'wonen',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Bouwaanduiding',
          objectid: 'NL.IMRO.718591de864b4f4b9beb7069297188e6',
          naam: 'gestapeld',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Functieaanduiding',
          objectid: 'NL.IMRO.0860f60156cf492f8e63eea3c75ffae5',
          naam: 'zorgwoning',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Maatvoering',
          objectid: 'NL.IMRO.47c384e1328646a7bf2cfd794471d8f8',
          naam: 'maximum goothoogte (m), maximum bouwhoogte (m)',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Bouwvlak',
          objectid: 'NL.IMRO.09ce6efd5e3e4752bffe0493074a6a03',
          naam: 'bouwvlak',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Gebiedsaanduiding',
          objectid: 'NL.IMRO.fb63cc184f6944938ebcab2406819bf0',
          naam: 'overige zone - specifieke archeologische waarden',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          categorie: 'Gebiedsaanduiding',
          classificatie: 'overige zone',
          layer: 'planobject_polygon',
        }),
      },
    ] as unknown as FeatureLike[];
    const featuresExpected = [
      {
        getProperties: () => ({
          type: 'Enkelbestemming',
          objectid: 'NL.IMRO.267f608c06a34620b2ba79c45b712d4f',
          naam: 'Wonen',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          categorie: 'Enkelbestemming',
          classificatie: 'wonen',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Bouwaanduiding',
          objectid: 'NL.IMRO.718591de864b4f4b9beb7069297188e6',
          naam: 'gestapeld',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Maatvoering',
          objectid: 'NL.IMRO.47c384e1328646a7bf2cfd794471d8f8',
          naam: 'maximum goothoogte (m), maximum bouwhoogte (m)',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Bouwvlak',
          objectid: 'NL.IMRO.09ce6efd5e3e4752bffe0493074a6a03',
          naam: 'bouwvlak',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Functieaanduiding',
          objectid: 'NL.IMRO.0860f60156cf492f8e63eea3c75ffae5',
          naam: 'zorgwoning',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          layer: 'planobject_polygon',
        }),
      },
      {
        getProperties: () => ({
          type: 'Gebiedsaanduiding',
          objectid: 'NL.IMRO.fb63cc184f6944938ebcab2406819bf0',
          naam: 'overige zone - specifieke archeologische waarden',
          planid: 'NL.IMRO.0200.bp1148-vas1',
          categorie: 'Gebiedsaanduiding',
          classificatie: 'overige zone',
          layer: 'planobject_polygon',
        }),
      },
    ] as unknown as FeatureLike[];
    const map = spectator.service.getMap();
    map.getFeaturesAtPixel = () => featuresWithDuplicates;
    map.dispatchEvent({ type: 'singleclick', pixel: [394.89404296875, 326.1979064941406] } as MapBrowserEvent<UIEvent>);

    spectator.service.featuresAtLocation.subscribe(features => {
      expect(features.length).toEqual(featuresExpected.length);
      features.forEach((f, i) =>
        // eslint-disable-next-line jasmine/new-line-before-expect
        expect(f.getProperties()['objectid']).toEqual(featuresExpected[i].getProperties()['objectid'])
      );
      done();
    });
  });
});
