import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import VectorTileLayer from 'ol/layer/VectorTile';
import { HighlightService } from '~viewer/kaart/services/highlight.service';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { KaartlaagFactoryService } from '~viewer/kaart/services/kaartlaag-factory.service';
import { KaartServiceMock } from '~viewer/kaart/services/kaart.service.mock';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { KaartlaagFactoryServiceMock } from '~viewer/kaart/services/kaartlaag-factory.service.mock';
import { mapboxStyleMock } from '~viewer/kaart/services/mapbox-style.mock';
import { MapboxStyle } from '~ozon-model-verbeelden/mapboxStyle';
import { Verbeelding } from '~ozon-model-verbeelden/verbeelding';

describe('HighlightService', () => {
  let kaartservice: KaartService;
  let spectator: SpectatorService<HighlightService>;

  const createService = createServiceFactory({
    service: HighlightService,
    imports: [HttpClientTestingModule],
    providers: [
      { provide: KaartService, useClass: KaartServiceMock },
      { provide: KaartlaagFactoryService, useClass: KaartlaagFactoryServiceMock },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    kaartservice = TestBed.inject(KaartService);
  });

  it('should addHighlightLayer Ozon with verbeelding', () => {
    const verbeelding: Verbeelding = { mapboxstyle: mapboxStyleMock as MapboxStyle, symboolmetadata: undefined };
    spectator.service.addHighlightLayerOzon(verbeelding, false);

    expect(kaartservice.getMap().getLayers().getLength()).toEqual(1);
    const layer: VectorTileLayer = kaartservice.getMap().getLayers().pop() as VectorTileLayer;

    expect(layer.getProperties()['id']).toEqual('highlight');
  });

  it('should addHighlightLayer IHR with documentid and locatieIds', () => {
    const documentId = 'NL.IMRO.plan';
    const locatieIds = ['123', '456'];
    spectator.service.addHighlightLayerIHR(documentId, locatieIds);

    expect(kaartservice.getMap().getLayers().getLength()).toEqual(1);
    const layer: VectorTileLayer = kaartservice.getMap().getLayers().pop() as VectorTileLayer;

    expect(layer.getProperties()['id']).toEqual('highlight');
  });

  it('should remove highlightLayer', () => {
    const documentId = 'NL.IMRO.plan';
    const locatieIds = ['123', '456'];
    spectator.service.addHighlightLayerIHR(documentId, locatieIds);

    expect(kaartservice.getMap().getLayers().getLength()).toEqual(1);

    spectator.service.removeHighlightLayer();

    expect(kaartservice.getMap().getLayers().getLength()).toEqual(0);
  });
});
