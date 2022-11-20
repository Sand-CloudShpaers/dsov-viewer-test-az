import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { FetchLocationInfoService } from '~viewer/kaart/services/fetch-location-info.service';
import { RdNapTransResponse } from '~model/internal/rdnaptrans';
import { ConfigService } from '~services/config.service';
import { KadastraalPerceel } from '~model/kadastralekaart/kadastraalperceel';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';

@Injectable()
export class SearchLocationService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private fetchLocationInfoService: FetchLocationInfoService
  ) {}

  public extractPerceelCode(identificatie: string): KadastraalPerceel {
    const perceel = identificatie.split('-');
    return { gemeenteCode: perceel[0], sectie: perceel[1], perceelnummer: perceel[2] };
  }

  public checkCoordinates$(coordinates: number[], isRd: boolean): Observable<number[]> {
    if (isRd) {
      return this.validCoordinates$(coordinates).pipe(
        map(valid => {
          if (!valid) {
            throw new Error('Niet gevonden in Nederland');
          }
          return coordinates;
        })
      );
    } else {
      return this.lookupRdNapTrans$(coordinates);
    }
  }

  public validCoordinates$(searchCoordinates: number[]): Observable<boolean> {
    if (searchCoordinates != null) {
      return this.fetchLocationInfoService
        .fetchOpenbareLichamen$(searchCoordinates)
        .pipe(map(response => !!response.length));
    } else {
      return of(false);
    }
  }

  public lookupRdNapTrans$(coordinates: number[], from = ZoekLocatieSystem.ETRS89): Observable<number[]> {
    const href = this.configService.config.rdNapTrans.url;
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Api-Key': this.configService.config.rdNapTrans.apiKey,
        'Content-Crs': from === ZoekLocatieSystem.ETRS89 ? 'EPSG:7931' : 'EPSG:7415',
        'Accept-Crs': from === ZoekLocatieSystem.ETRS89 ? 'EPSG:7415' : 'EPSG:7931',
      }),
    };
    const body = {
      data: {
        type: 'Point',
        coordinates,
      },
    };

    return this.http.post<RdNapTransResponse>(href, body, httpOptions).pipe(
      mergeMap(response =>
        combineLatest([of(response), this.fetchLocationInfoService.fetchOpenbareLichamen$(response.data.coordinates)])
      ),
      map(([response, openbareLichamen]) => {
        if ((!openbareLichamen.length && from === ZoekLocatieSystem.ETRS89) || !response.data.coordinates) {
          const error = new Error('Het zoekgebied bevindt zich buiten Nederland.');
          error.name = 'Buiten Nederland';
          throw error;
        }
        return response.data.coordinates;
      })
    );
  }
}
