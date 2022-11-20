import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import GeoJSON from 'ol/format/GeoJSON';
import Geometry from 'ol/geom/Geometry';
import { ConfigService } from '~services/config.service';
import { IhrHttpClient } from '~http/ihr.http-client';
import { map } from 'rxjs/operators';
import { TekstCollectie } from '~ihr-model/tekstCollectie';
import { Plan } from '~ihr-model/plan';
import { Tekst } from '~ihr-model/tekst';
import { BekendmakingCollectie } from '~ihr-model/bekendmakingCollectie';
import { GerelateerdPlanCollectie } from '~ihr-model/gerelateerdPlanCollectie';
import { PlanCollectie } from '~ihr-model/planCollectie';
import { GeometryCollection } from 'ol/geom';

@Injectable()
export class IhrDocumentService {
  constructor(private ihrHTTPClient: IhrHttpClient, private configService: ConfigService) {}

  public getIhrDocument$(documentId: string): Observable<Plan> {
    const options = this.ihrHTTPClient.requestOptions(false, true);
    return this.ihrHTTPClient
      .get$<Plan>(`${this.configService.config.ihr.url}/plannen/${documentId}?expand=bbox`, options)
      .pipe(map(plan => plan));
  }

  public getIhrDocumentOnderdelen$(documentId: string, onderdeelHref: string): Observable<Tekst> {
    const options = this.ihrHTTPClient.requestOptions(false, false);
    const href = onderdeelHref
      ? onderdeelHref
      : `${this.configService.config.ihr.url}/plannen/${documentId}/teksten?niveau=1`;
    return this.ihrHTTPClient.get$<Tekst>(href, options).pipe(map(response => response));
  }

  public getIhrDocumentElementById$(documentId: string, elementId: string): Observable<Tekst> {
    const options = this.ihrHTTPClient.requestOptions(false, false);
    const href = `${this.configService.config.ihr.url}/plannen/${documentId}/teksten/${elementId}?expand=children`;
    return this.ihrHTTPClient.get$<Tekst>(href, options).pipe(map(response => response));
  }

  public getIhrDocumentStructuur$(documentId: string, parentId: string): Observable<TekstCollectie> {
    const options = this.ihrHTTPClient.requestOptions(false, false);
    return this.ihrHTTPClient
      .get$<TekstCollectie>(
        `${this.configService.config.ihr.url}/plannen/${documentId}/teksten?ouderId=${parentId}`,
        options
      )
      .pipe(map(response => response));
  }

  public loadMoreIhrDocumentStructuur$(url: string): Observable<TekstCollectie> {
    const options = this.ihrHTTPClient.requestOptions(false, false);
    return this.ihrHTTPClient.get$<TekstCollectie>(url, options).pipe(map(response => response));
  }

  public getIhrDocumentTekstenByPlanobjectId$(documentId: string, planobjectId: string): Observable<TekstCollectie> {
    const options = this.ihrHTTPClient.requestOptions(false, false);
    return this.ihrHTTPClient
      .get$<TekstCollectie>(
        `${this.configService.config.ihr.url}/plannen/${documentId}/teksten?planobjectId=${planobjectId}&expand=children.children`,
        options
      )
      .pipe(map(response => response));
  }

  public getIhrDocumentArtikelen$(documentId: string, geometry: Geometry): Observable<TekstCollectie> {
    const options = this.ihrHTTPClient.requestOptions(true, false);

    // TODO: Temporary workaround for requests with a GeometryCollection
    // See: https://owviewer.atlassian.net/browse/OVREK-6790
    const geojson = new GeoJSON().writeGeometryObject(geometry, { decimals: 3 });

    return this.ihrHTTPClient
      .post$<TekstCollectie>(
        `${this.configService.config.ihr.url}/plannen/${documentId}/artikelen/_zoek?pageSize=100`,
        {
          _geo: {
            ...(geometry instanceof GeometryCollection ? { intersects: geojson } : { intersectAndNotTouches: geojson }),
          },
        },
        options
      )
      .pipe(map(response => response));
  }

  public getIHRBekendmakingen$(documentId: string): Observable<BekendmakingCollectie> {
    const options = this.ihrHTTPClient.requestOptions(false, false);
    return this.ihrHTTPClient
      .get$<BekendmakingCollectie>(`${this.configService.config.ihr.url}/plannen/${documentId}/bekendmakingen`, options)
      .pipe(map(response => response));
  }

  public fetchGerelateerdePlannen$(documentId: string): Observable<GerelateerdPlanCollectie> {
    return this.ihrHTTPClient.get$<GerelateerdPlanCollectie>(
      `${this.configService.config.ihr.url}/plannen/${documentId}/gerelateerde-plannen`,
      this.ihrHTTPClient.requestOptions(false, false)
    );
  }

  public fetchPlannenByDossierId$(dossierId: string): Observable<PlanCollectie> {
    return dossierId
      ? this.ihrHTTPClient.get$(
          `${this.configService.config.ihr.url}/plannen?dossier.id=${dossierId}`,
          this.ihrHTTPClient.requestOptions(false, false)
        )
      : of(null);
  }
}
