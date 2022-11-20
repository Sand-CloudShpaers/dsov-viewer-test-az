import { Injectable } from '@angular/core';
import GeoJSON from 'ol/format/GeoJSON';
import { Observable } from 'rxjs';
import { GeoUtils } from '~general/utils/geo.utils';
import { IhrHttpClient, PostBodyIHR } from '~http/ihr.http-client';
import { Maatvoering } from '~ihr-model/maatvoering';
import { LocatieFilter } from '~viewer/filter/types/filter-options';
import { PlanCollectie } from '~ihr-model/planCollectie';
import { PlanSuggestieCollectie } from '~ihr-model/planSuggestieCollectie';
import { ConfigService } from '~services/config.service';
import { Bestemmingsvlak } from '~ihr-model/bestemmingsvlak';
import { Gebiedsaanduiding } from '~ihr-model/gebiedsaanduiding';
import { Functieaanduiding } from '~ihr-model/functieaanduiding';
import { Bouwaanduiding } from '~ihr-model/bouwaanduiding';
import { CartografieSummaryCollectie } from '~ihr-model/cartografieSummaryCollectie';
import { Info } from '~ihr-model/info';
import { GeometryCollection } from 'ol/geom';

@Injectable()
export class IhrProvider {
  constructor(private http: IhrHttpClient, private configService: ConfigService) {}

  public static constructPostBodyIHR(location: LocatieFilter): PostBodyIHR {
    // TODO: Temporary workaround for requests with a GeometryCollection
    // See: https://owviewer.atlassian.net/browse/OVREK-6790
    if (!location.geometry) {
      return undefined;
    }

    const geometry = GeoUtils.roundCoordinates(
      location.shouldBuffer
        ? GeoUtils.getBufferGeometry(location.geometry)
        : new GeoJSON().writeGeometryObject(location.geometry)
    );
    return {
      _geo: {
        ...(location.geometry instanceof GeometryCollection
          ? { intersects: geometry }
          : { intersectAndNotTouches: geometry }),
      },
    };
  }

  public createIhrplannenUrl(queryParamString = ''): string {
    return `${this.configService.config.ihr.url}/plannen/_zoek${queryParamString}`;
  }

  public fetchIhrplannenByUrl$(url: string, location: LocatieFilter): Observable<PlanCollectie> {
    const options = this.http.requestOptions(true, true);
    return this.http.post$(url, IhrProvider.constructPostBodyIHR(location), options);
  }

  public fetchMaatvoering$(itemId: string, planId: string): Observable<Maatvoering> {
    return this.http.get$(
      `${this.configService.config.ihr.url}/plannen/${planId}/maatvoeringen/${itemId}`,
      this.http.requestOptions(false, false)
    );
  }

  public fetchPlanSuggestions$(value: string): Observable<PlanSuggestieCollectie> {
    return this.http.get$(
      `${this.configService.config.ihr.url}/plannen/_plansuggesties?zoekTerm=${value}`,
      this.http.requestOptions(false, false)
    );
  }

  public fetchBestemmingsplanFeature$(
    href: string
  ): Observable<Bestemmingsvlak | Gebiedsaanduiding | Functieaanduiding | Maatvoering | Bouwaanduiding> {
    return this.http.get$(href, this.http.requestOptions(false, false));
  }

  public fetchCartografieSummaries$(planId: string, objectIds: string[]): Observable<CartografieSummaryCollectie> {
    const options = this.http.requestOptions(true, true);
    if (objectIds.length) {
      return this.http.post$(
        `${this.configService.config.ihr.url}/plannen/${planId}/cartografiesummaries`,
        {
          ids: objectIds,
        },
        options
      );
    } else {
      return this.http.get$(`${this.configService.config.ihr.url}/plannen/${planId}/cartografiesummaries`, options);
    }
  }

  public fetchAppInfo$(): Observable<Info> {
    return this.http.get$<Info>(`${this.configService.config.ihr.url}/info`, this.http.requestOptions(false, false));
  }
}
