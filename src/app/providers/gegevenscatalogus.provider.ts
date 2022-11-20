import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { GegevenscatalogusHttpClient } from '~http/gegevenscatalogus.http-client';
import { Documenttype } from '~model/gegevenscatalogus/documenttype';
import { PlanBeleidsmatigverantwoordlijkeoverheidType } from '~model/gegevenscatalogus/plan-beleidsmatigverantwoordlijkeoverheid-type';
import { PlanType } from '~model/gegevenscatalogus/plan-type';
import { Thema } from '~model/gegevenscatalogus/thema';
import { ConfigService } from '~services/config.service';
import { NoCacheHeaders } from '~services/no-cache-headers';
import { RegelgevingtypeFilter } from '~viewer/filter/types/filter-options';
@Injectable({ providedIn: 'root' })
export class GegevenscatalogusProvider {
  private planTypes: PlanType[];
  private planBeleidsmatigverantwoordelijkeoverheidTypes: PlanBeleidsmatigverantwoordlijkeoverheidType[];
  private themas: Thema[];
  private documenttypes: Documenttype[];
  private regelgevingtypeFilters: RegelgevingtypeFilter[];

  constructor(private http: GegevenscatalogusHttpClient, private configService: ConfigService) {}

  public getPlanTypes$(): Observable<PlanType[]> {
    if (this.planTypes) {
      return of(this.planTypes);
    }

    return this.http
      .get$(`${this.configService.gegevenscatalogusUrl}/plan-types.json`, {
        headers: NoCacheHeaders,
      })
      .pipe(
        map(response => {
          this.planTypes = response as PlanType[];
          return this.planTypes;
        })
      );
  }

  public getPlanBeleidsmatigverantwoordelijkeoverheidTypes$(): Observable<
    PlanBeleidsmatigverantwoordlijkeoverheidType[]
  > {
    if (this.planBeleidsmatigverantwoordelijkeoverheidTypes) {
      return of(this.planBeleidsmatigverantwoordelijkeoverheidTypes);
    }

    return this.http
      .get$(`${this.configService.gegevenscatalogusUrl}/plan-beleidsmatigverantwoordelijkeoverheid-types.json`, {
        headers: NoCacheHeaders,
      })
      .pipe(
        map(response => {
          this.planBeleidsmatigverantwoordelijkeoverheidTypes =
            response as PlanBeleidsmatigverantwoordlijkeoverheidType[];
          return this.planBeleidsmatigverantwoordelijkeoverheidTypes;
        })
      );
  }

  public getThemas$(): Observable<Thema[]> {
    if (this.themas) {
      return of(this.themas);
    }

    return this.http
      .get$(`${this.configService.gegevenscatalogusUrl}/themas.json`, {
        headers: NoCacheHeaders,
      })
      .pipe(
        map(response => {
          this.themas = response as Thema[];
          return this.themas;
        })
      );
  }

  public getDocumenttypes$(): Observable<Documenttype[]> {
    if (this.documenttypes) {
      return of(this.documenttypes);
    }

    return this.http
      .get$(`${this.configService.gegevenscatalogusUrl}/documenttypes.json`, {
        headers: NoCacheHeaders,
      })
      .pipe(
        map(response => {
          this.documenttypes = response as Documenttype[];
          return this.documenttypes;
        })
      );
  }

  public getRegelgevingTypes$(): Observable<RegelgevingtypeFilter[]> {
    if (this.regelgevingtypeFilters) {
      return of(this.regelgevingtypeFilters);
    }

    return this.http
      .get$(`${this.configService.gegevenscatalogusUrl}/regelgevingtypes.json`, {
        headers: NoCacheHeaders,
      })
      .pipe(
        map(response => {
          this.regelgevingtypeFilters = response as RegelgevingtypeFilter[];
          return this.regelgevingtypeFilters;
        })
      );
  }
}
