import { Injectable } from '@angular/core';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { ZoekLocatieInfo } from '~model/internal/zoek-locatie-info';

@Injectable({
  providedIn: 'root',
})
export class LocationInfoNavigationServiceMock {
  public searchGemeente(_locationInfo: ZoekLocatieInfo, _path: ViewerPage): void {}

  public searchCoordinates(_locationInfo: ZoekLocatieInfo, _path: ViewerPage): void {}

  public searchCadastral(_locationInfo: ZoekLocatieInfo, _path: ViewerPage): void {}

  public searchAddress(_locationInfo: ZoekLocatieInfo, _path: ViewerPage): void {}

  public clearFilters(): void {}
}
