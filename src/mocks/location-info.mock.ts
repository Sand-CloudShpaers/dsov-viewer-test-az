import {
  ZoekLocatieCoordinates,
  ZoekLocatieInfo,
  ZoekLocatieNaam,
  ZoekLocatieSystem,
} from '~model/internal/zoek-locatie-info';

export class LocationInfoMock implements ZoekLocatieInfo {
  public gemeente: ZoekLocatieNaam = {
    pdokid: '000',
    weergavenaam: 'gemeente',
  };
  public adres: ZoekLocatieNaam = {
    pdokid: '123',
    weergavenaam: 'straatnaam nummer postcode woonplaats',
  };
  public coordinaten: ZoekLocatieCoordinates = {
    system: ZoekLocatieSystem.RD,
    [ZoekLocatieSystem.RD]: [10, 20],
  };
  public perceel: ZoekLocatieNaam = {
    pdokid: '456',
    weergavenaam: 'perceel',
  };
  public stelsel = 'RD';
}
