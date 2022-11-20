import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterUtils, LOCATIE_ID_TYPE, LocatieIdType, ZoekParameters } from '~general/utils/filter.utils';
import { GeoJsonZoekObject, OzonHttpClient } from '~http/ozon.http-client';
import { Info } from '~ozon-model/info';
import { LocatieZoekgebieden } from '~ozon-model/locatieZoekgebieden';
import { Omgevingsvergunningen } from '~ozon-model/omgevingsvergunningen';
import { OntwerpLocatieZoekgebieden } from '~ozon-model/ontwerpLocatieZoekgebieden';
import { OntwerpRegelingen } from '~ozon-model/ontwerpRegelingen';
import { Regelingen } from '~ozon-model/regelingen';
import { ConfigService } from '~services/config.service';
import { FilterOptions, LocatieFilter } from '~viewer/filter/types/filter-options';
import { GeoUtils } from '~general/utils/geo.utils';
import GeoJSON from 'ol/format/GeoJSON';
import { GeoJsonZoekobject } from '~ozon-model/geoJsonZoekobject';
import { GeneriekZoekobject } from '~ozon-model-verbeelden/generiekZoekobject';
import { Verbeelding } from '~ozon-model-verbeelden//verbeelding';
import { HttpClient } from '@angular/common/http';
import { Selection, SelectionObjectType } from '~store/common/selection/selection.model';
import { LocatieMetBoundingBox } from '~ozon-model/locatieMetBoundingBox';
import { ApiUtils } from '~general/utils/api.utils';
import { TimeTravelQueryParams } from '~store/common/navigation/types/query-params';
import { ActivatedRoute } from '@angular/router';
import { Voorkomens } from '~ozon-model/voorkomens';
import { getEscapedDocumentId } from '~viewer/documenten/utils/document-utils';
import { TimeTravelDates } from '~model/time-travel-dates';
import { RegelingSuggestieCollectie } from '~ozon-model/regelingSuggestieCollectie';
import { isTimeTravelLayer } from '~viewer/filter/helpers/filters';

@Injectable()
export class OzonProvider {
  constructor(
    private httpClient: HttpClient,
    private ozonHttpClient: OzonHttpClient,
    private configService: ConfigService,
    private route: ActivatedRoute
  ) {}

  public static constructGeoParameters(location: LocatieFilter): GeoJsonZoekObject {
    // De coördinaten worden afgerond op 3 decimalen omdat Ozon
    // meer dan 3 decimalen afkeurt.
    // dit afronden gebeurt met een floor operator omdat anders bij
    // de gebufferde gemeente IJsselstein een foutsituatie ontstaat
    if (location.geometry != null) {
      return {
        geometrie: GeoUtils.roundCoordinates(
          location.shouldBuffer
            ? GeoUtils.getBufferGeometry(location.geometry)
            : new GeoJSON().writeGeometryObject(location.geometry)
        ),
        spatialOperator: GeoJsonZoekobject.SpatialOperatorEnum.Intersects,
      };
    }
    return null;
  }

  public fetchRegelingen$(
    locatieIds: string[],
    filterOptions: FilterOptions,
    regelingenUrl: string
  ): Observable<Regelingen> {
    return this.fetchRegelingenByUrl$(
      `${this.configService.config.ozon.url}${regelingenUrl}?page=0&size=${this.configService.ozonMaxResponseSize}`,
      locatieIds,
      filterOptions
    );
  }

  public fetchRegelingenByUrl$(
    url: string,
    locatieIds: string[],
    filterOptions: FilterOptions
  ): Observable<Regelingen> {
    return this.ozonHttpClient.post$<Regelingen>(
      url,
      FilterUtils.getPostBodyOzonFromFilters(LOCATIE_ID_TYPE.locatieIdentificatie, locatieIds, filterOptions, url),
      this.ozonHttpClient.requestOptions(true, true, null)
    );
  }

  public fetchOntwerpRegelingen$(
    locatieIdType: LocatieIdType,
    locatieIds: string[],
    filterOptions: FilterOptions,
    regelingenUrl: string
  ): Observable<OntwerpRegelingen> {
    return this.fetchOntwerpRegelingenByUrl$(
      `${this.configService.config.ozon.url}${regelingenUrl}?page=0&size=${this.configService.ozonMaxResponseSize}`,
      locatieIdType,
      locatieIds,
      filterOptions
    );
  }

  public fetchOntwerpRegelingenByUrl$(
    url: string,
    locatieIdType: LocatieIdType,
    locatieIds: string[],
    filterOptions: FilterOptions
  ): Observable<OntwerpRegelingen> {
    return this.ozonHttpClient.post$<OntwerpRegelingen>(
      url,
      FilterUtils.getPostBodyOzonFromFilters(locatieIdType, locatieIds, filterOptions, url),
      this.ozonHttpClient.requestOptions(true, true, null)
    );
  }

  public fetchOmgevingsvergunningen$(
    ozonLocaties: string[],
    page: number,
    size: number
  ): Observable<Omgevingsvergunningen> {
    const zoekParameters: ZoekParameters[] = [];
    zoekParameters.push({
      parameter: LOCATIE_ID_TYPE.locatieIdentificatie,
      zoekWaarden: ozonLocaties,
    });
    const url = `${this.configService.config.ozon.url}/omgevingsvergunningen/_zoek?page=${page}&size=${
      size || this.configService.ozonMaxResponseSize
    }`;

    return this.ozonHttpClient.post$<Omgevingsvergunningen>(
      url,
      {
        zoekParameters,
      },
      this.ozonHttpClient.requestOptions(true, true, null)
    );
  }

  public fetchOmgevingsvergunnningenByUrl$(
    url: string,
    locatieIds: string[],
    filterOptions: FilterOptions
  ): Observable<Omgevingsvergunningen> {
    return this.ozonHttpClient.post$<Omgevingsvergunningen>(
      url,
      FilterUtils.getPostBodyOzonFromFilters(LOCATIE_ID_TYPE.locatieIdentificatie, locatieIds, filterOptions, url),
      this.ozonHttpClient.requestOptions(true, true, null)
    );
  }

  public fetchVoorkomens$(identificatie: string): Observable<Voorkomens> {
    return this.ozonHttpClient.get$<Voorkomens>(
      `${this.configService.config.ozon.url}/regelingen/${getEscapedDocumentId(identificatie)}/voorkomens`,
      this.ozonHttpClient.requestOptions(false, false, null)
    );
  }

  public fetchRegelingSuggestions$(value: string): Observable<RegelingSuggestieCollectie> {
    return this.ozonHttpClient.get$<RegelingSuggestieCollectie>(
      `${this.configService.config.ozon.url}/regelingen/_suggesties?zoekTerm=${value}`,
      this.ozonHttpClient.requestOptions(false, false, null)
    );
  }

  public fetchOzonLocatiesByGeo$(
    location: LocatieFilter,
    timeTravelDates?: TimeTravelDates
  ): Observable<[LocatieZoekgebieden, OntwerpLocatieZoekgebieden]> {
    const options = this.ozonHttpClient.requestOptions(true, false, null);
    return forkJoin([
      this.ozonHttpClient
        .post$<LocatieZoekgebieden>(
          // Bij een refresh en tijdreizen is op dit moment de query-parameter datum nog niet aanwezig in de url
          // In dit geval ontvangen we de datum vanuit het aanroepende effect loadOzonLocaties$
          ApiUtils.addTimeTravelAsQueryParamStringForOzon(
            `${this.configService.config.ozon.url}/locatieidentificaties/_zoek`,
            timeTravelDates
          ),
          { geo: OzonProvider.constructGeoParameters(location) },
          options
        )
        .pipe(
          map(response => {
            const locatieidentificaties = response?._embedded?.locatieidentificaties;
            if (!locatieidentificaties || locatieidentificaties.length === 0) {
              throw new Error('Geen locatieidentificaties');
            }
            return response;
          })
        ),
      this.ozonHttpClient.post$<OntwerpLocatieZoekgebieden>(
        `${this.configService.config.ozon.url}/ontwerplocaties/technischids/_zoek`,
        { geo: OzonProvider.constructGeoParameters(location) },
        options
      ),
    ]);
  }

  public fetchPresenterenInfo$(): Observable<Info> {
    return this.ozonHttpClient.get$<Info>(
      `${this.configService.config.ozon.url}/app-info`,
      this.ozonHttpClient.requestOptions(false, false, null)
    );
  }

  public fetchVerbeeldenInfo$(): Observable<Info> {
    return this.ozonHttpClient.get$<Info>(
      `${this.configService.config.ozonVerbeelden.url}/app-info`,
      this.ozonHttpClient.requestOptions(false, false, null)
    );
  }

  public fetchLocatieMetBoundingBox$(href: string): Observable<LocatieMetBoundingBox> {
    return this.ozonHttpClient.get$<LocatieMetBoundingBox>(
      href,
      this.ozonHttpClient.requestOptions(false, false, null)
    );
  }

  public fetchVerbeelding$(selections: Selection[]): Observable<Verbeelding> {
    const currentParams = this.route.snapshot.queryParams;
    let queryParams = '';
    if (isTimeTravelLayer(currentParams)) {
      queryParams += `?beschikbaarOp=${currentParams.beschikbaarOp}&inWerkingOp=${currentParams.inWerkingOp}&geldigOp=${currentParams.geldigOp}`;
    }

    const url = ApiUtils.addTimeTravelAsQueryParamStringForOzon(
      `${this.configService.config.ozonVerbeelden.url}/symbolen/mapbox/_zoek${queryParams}`,
      { geldigOp: this.route.snapshot.queryParams[TimeTravelQueryParams.DATE] }
    );

    return this.httpClient.post<Verbeelding>(
      url,
      { zoekObjecten: this.getVerbeeldingPostBody(selections) },
      this.ozonHttpClient.requestOptions(false, false, null)
    );
  }

  private getVerbeeldingPostBody(selections: Selection[]): GeneriekZoekobject[] {
    return selections.map(selection => {
      const objectType = `${selection.isOntwerp ? 'Ontwerp' : ''}${
        selection.objectType
      }Zoekobject` as GeneriekZoekobject.ObjectTypeEnum;

      const primairObjectIdentificator = selection.isOntwerp
        ? 'primairObjectTechnischId'
        : 'primairObjectIdentificatie';

      if (
        // Omgevingsnormen, omgevingswaarden of kaarten
        [
          SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
          SelectionObjectType.OMGEVINGSWAARDE_NORMWAARDE,
          SelectionObjectType.KAART_KAARTLAAG,
        ].includes(selection.objectType)
      ) {
        return {
          objectType,
          primairObjectIdentificator: {
            [primairObjectIdentificator]: selection.parentId,
          },
          secundaireObjectIdentificatoren: [selection.id],
        };
      } else if (
        // Werkingsgebieden/locaties of Activiteitlocatieaanduidingen
        [SelectionObjectType.WERKINGSGEBIED, SelectionObjectType.REGELTEKST_ACTIVITEITLOCATIEAANDUIDING].includes(
          selection.objectType
        )
      ) {
        return {
          objectType,
          primairObjectIdentificator: {
            [primairObjectIdentificator]: selection.regeltekstTechnischId || selection.regeltekstIdentificatie,
          },
          secundaireObjectIdentificatoren: [selection.id],
        };
      } else {
        // Overige, dus geen secundaire elementen
        return {
          objectType,
          primairObjectIdentificator: {
            [primairObjectIdentificator]: selection.id,
          },
          secundaireObjectIdentificatoren: [],
        };
      }
    });
  }
}
