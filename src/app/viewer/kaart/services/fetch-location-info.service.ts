import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ZoekLocatieInfo, ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { ConfigService } from '~services/config.service';
import { ReverseGeocoderResponse } from '../types/reverse-geocoder.model';
import { OpenbaarLichaam, OpenbareLichamen } from '~model/bestuurlijkegrenzen/openbare-lichamen';
import { PdokService } from '~viewer/search/services/pdok-service';

@Injectable({
  providedIn: 'root',
})
export class FetchLocationInfoService {
  private coordinates$: Subject<number[]>;

  constructor(private http: HttpClient, private configService: ConfigService, private pdokService: PdokService) {
    this.coordinates$ = new Subject();
  }

  public set coordinates(coordinate: number[]) {
    if (coordinate) {
      this.coordinates$.next(coordinate);
    }
  }

  public fetchOpenbareLichamen$(coordinates: number[]): Observable<OpenbaarLichaam[]> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', '*/*');
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('x-api-key', `${this.configService.config.bestuurlijkeGrenzen.apiKey}`);
    headers = headers.append('Content-CRS', 'epsg:28992');
    headers = headers.append('Accept-CRS', 'epsg:28992');

    return this.http
      .post<OpenbareLichamen>(
        `${this.configService.config.bestuurlijkeGrenzen.url}/openbare-lichamen/_zoek`,
        {
          geometrie: {
            intersects: {
              type: 'Point',
              coordinates,
            },
          },
        },
        {
          headers,
        }
      )
      .pipe(map(response => response._embedded.openbareLichamen));
  }

  public getZoekLocatieInfo$(coordinates: number[]): Observable<ZoekLocatieInfo> {
    return this.fetchOpenbareLichamen$(coordinates).pipe(
      switchMap(openbareLichamen => {
        if (openbareLichamen.length === 0) {
          return of({});
        }
        const zoekLocatieInfo: ZoekLocatieInfo = {
          coordinaten: {
            [ZoekLocatieSystem.RD]: coordinates.map(x => Math.floor(x)),
            system: ZoekLocatieSystem.RD,
          },
          noZoom: false,
        };
        const gemeentes = openbareLichamen.filter(openbaarLichaam => openbaarLichaam.bestuurslaag === 'gemeente');
        if (gemeentes.length === 0) {
          zoekLocatieInfo.noZoom = true;
          return of(zoekLocatieInfo);
        }
        const query = `X=${coordinates[0]}&Y=${coordinates[1]}&type=gemeente&type=perceel&distance=0`;
        return this.fetchGemeenteEnPerceel$(query, zoekLocatieInfo).pipe(
          switchMap(_locatieInfo => {
            // alleen het dichtsbijzijnde adres opzoeken
            const queryAdres = `X=${coordinates[0]}&Y=${coordinates[1]}&type=adres&rows=1`;
            return this.fetchAdres$(queryAdres, zoekLocatieInfo);
          })
        );
      })
    );
  }

  private fetchGemeenteEnPerceel$(query: string, zoekLocatieInfo: ZoekLocatieInfo): Observable<ZoekLocatieInfo> {
    return this.pdokService.getLocatiesByPoint$(query).pipe(
      map((reverseGeocoderResponse: ReverseGeocoderResponse) => {
        const gemeentes = reverseGeocoderResponse.response.docs.filter(doc => doc.type === 'gemeente');
        const percelen = reverseGeocoderResponse.response.docs.filter(doc => doc.type === 'perceel');
        if (gemeentes[0]) {
          zoekLocatieInfo.gemeente = {
            weergavenaam: gemeentes[0].weergavenaam,
            pdokid: gemeentes[0].id,
          };
        }
        if (percelen[0]) {
          zoekLocatieInfo.perceel = {
            weergavenaam: percelen[0].weergavenaam,
            pdokid: percelen[0].id,
          };
        }
        return zoekLocatieInfo;
      })
    );
  }

  private fetchAdres$(query: string, zoekLocatieInfo: ZoekLocatieInfo): Observable<ZoekLocatieInfo> {
    return this.pdokService.getLocatiesByPoint$(query).pipe(
      switchMap((reverseGeocoderResponse: ReverseGeocoderResponse) => {
        if (reverseGeocoderResponse.response.docs.length === 0) {
          return of(zoekLocatieInfo);
        }

        const adres = reverseGeocoderResponse.response.docs[0];

        // check of perceel bij adres hoort anders adres niet toevoegen
        const adresOnderdelen = zoekLocatieInfo.perceel?.weergavenaam?.split('(');
        const zoekPerceel = adresOnderdelen?.length > 1 ? `(${adresOnderdelen[1]}` : null;

        return this.pdokService.lookupLocation$(`fl=*&id=${adres.id}`).pipe(
          map(lookup => {
            const lookupDoc = lookup.docs[0];

            // Voeg het adres toe wanneer: het gekoppelde perceel dat bij het adres hoort, overeenkomt met het perceel op die locatie.
            // Dit zorgt ervoor dat bij een verkeerde koppeling het adres niet wordt weergegeven.
            // Echter, wanneer geen perceel worden gevonden op de betreffende locatie nemen we aan dat het adres klopt en tonen we het.
            if (
              !zoekPerceel ||
              (lookupDoc.gekoppeld_perceel && this.checkGekoppeldPerceel(lookupDoc.gekoppeld_perceel, zoekPerceel))
            ) {
              zoekLocatieInfo.adres = {
                weergavenaam: adres.weergavenaam,
                pdokid: adres.id,
              };
            }

            return zoekLocatieInfo;
          })
        );
      })
    );
  }

  // alternatief voor huidige methode:
  // eerst bag pand opzoeken mbv kliklocatie
  // dan mbv pand geometrie de bijbehorende adressen zoeken

  private checkGekoppeldPerceel(gekoppeldePercelen: string[], zoekPerceel: string): boolean {
    // zorg voor eenzelfde formaat
    gekoppeldePercelen.forEach(perceel => {
      const onderdelen = perceel.split('-');
      gekoppeldePercelen.push(`(${onderdelen[0]}) ${onderdelen[1]} ${onderdelen[2]}`);
    });
    return gekoppeldePercelen.includes(zoekPerceel);
  }
}
