import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { and as AndFilter, equalTo as EqualToFilter } from 'ol/format/filter';
import And from 'ol/format/filter/And';
import Or from 'ol/format/filter/Or';
import WFS from 'ol/format/WFS';
import { Observable } from 'rxjs';
import { ConfigService } from '~services/config.service';
import { KadastraalPerceel } from '~model/kadastralekaart/kadastraalperceel';
import { PDOKLookupResponse, PDOKLookupResponseBody } from '~model/georegister';
import { map } from 'rxjs/operators';
import { PDOK } from '../types/pdok';
import { SuggestDoc, SuggestResponseBody } from '~model/georegister/suggest.model';
import { ReverseGeocoderResponse } from '~viewer/kaart/types/reverse-geocoder.model';

@Injectable()
export class PdokService {
  constructor(private http: HttpClient, protected configService: ConfigService) {}

  public suggestLocations$(query: string): Observable<SuggestDoc[]> {
    return this.http
      .get<SuggestResponseBody>(`${this.configService.config.locationService.url}/suggest?${query}`)
      .pipe(map((body: SuggestResponseBody): SuggestDoc[] => body.response.docs));
  }

  public lookupLocation$(query: string): Observable<PDOKLookupResponseBody> {
    return this.http
      .get<PDOKLookupResponse>(`${this.configService.config.locationService.url}/lookup?${query}`)
      .pipe(map(body => body.response));
  }

  public getLocatiesByPoint$(query: string): Observable<ReverseGeocoderResponse> {
    return this.http
      .get<ReverseGeocoderResponse>(`${this.configService.config.pdok.url}locatieserver/revgeo?${query}`)
      .pipe(map(body => body));
  }

  public getPercelen$(percelen: KadastraalPerceel[]): Observable<PDOK> {
    const featureRequestBody = new WFS({ version: '2.0.0' }).writeGetFeature({
      srsName: 'EPSG:28992',
      featureNS: this.configService.config.wfsKadastralekaart.url,
      featurePrefix: 'perceelv4',
      featureTypes: ['perceel'],
      outputFormat: 'application/json',
      filter: this.getPerceelFilters(percelen),
    });
    return this.http.post<PDOK>(
      this.configService.config.wfsKadastralekaart.url,
      new XMLSerializer().serializeToString(featureRequestBody)
    );
  }

  /**
   * OrFilter kan alleen geïnitieerd worden met
   * minimaal twee geldige condities (zoals AndFilters)
   *
   */
  private getPerceelFilters(percelen: KadastraalPerceel[]): And | Or | undefined {
    if (percelen.length === 1) {
      return PdokService.getPerceelFilter(percelen[0]);
    } else if (percelen.length > 1) {
      const conditions = percelen.map(parcel => PdokService.getPerceelFilter(parcel));
      return new Or(...conditions);
    }
    return undefined;
  }

  private static getPerceelFilter(perceel: KadastraalPerceel): And {
    return AndFilter(
      EqualToFilter('AKRKadastraleGemeenteCodeWaarde', perceel.gemeenteCode.trim()),
      EqualToFilter('perceelnummer', perceel.perceelnummer.trim()),
      EqualToFilter('sectie', perceel.sectie.trim())
    );
  }
}
