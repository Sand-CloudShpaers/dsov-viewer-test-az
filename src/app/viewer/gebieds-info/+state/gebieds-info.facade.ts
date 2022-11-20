import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from './index';
import * as fromGebiedsaanwijzingen from './gebiedsaanwijzingen/gebiedsaanwijzingen.selectors';
import * as fromOmgevingsnormen from './omgevingsnormen/omgevingsnormen.selectors';
import * as fromOmgevingswaarden from './omgevingswaarden/omgevingswaarden.selectors';
import * as fromGebiedsInfo from './gebieds-info.selectors';
import * as OmgevingsnormenActions from './omgevingsnormen/omgevingsnormen.actions';
import * as OmgevingswaardenActions from './omgevingswaarden/omgevingswaarden.actions';
import * as GebiedsaanwijzingenActions from './gebiedsaanwijzingen/gebiedsaanwijzingen.actions';
import { GebiedsaanwijzingenVM, GebiedsaanwijzingVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';
import { OmgevingsnormenVM } from '~viewer/normen/types/omgevingsnormenVM';
import { GebiedsInfoStoreModule } from './gebieds-info-store.module';
import { ViewSelectionItems } from '../types/gebieds-info.model';
import { getOmgevingsplanPons } from '~store/common/ozon-locaties/+state/ozon-locaties.selectors';
import { getActiveLocationIsLargeArea } from '~viewer/filter/+state/filter.selectors';

@Injectable({
  providedIn: GebiedsInfoStoreModule,
})
export class GebiedsInfoFacade {
  public readonly omgevingsplanPons$: Observable<boolean> = this.store.pipe(select(getOmgevingsplanPons));
  public readonly activeLocationIsLargeArea$: Observable<boolean> = this.store.pipe(
    select(getActiveLocationIsLargeArea)
  );

  public readonly getViewSelectionLoadingStatus$ = this.store.pipe(
    select(fromGebiedsInfo.getViewSelectionLoadingStatus)
  );

  public readonly getViewSelectionItems$: Observable<ViewSelectionItems> = this.store.pipe(
    select(fromGebiedsInfo.getViewSelectionItems)
  );

  public readonly getOverzichtGebieden$: Observable<GebiedsaanwijzingVM[]> = this.store.pipe(
    select(fromGebiedsaanwijzingen.selectGebiedsaanwijzingenForOverzichtVM)
  );

  public readonly getOmgevingsnormenStatus$ = this.store.pipe(select(fromOmgevingsnormen.getOmgevingsnormenStatus));
  public readonly getOmgevingsnormen$: Observable<OmgevingsnormenVM[]> = this.store.pipe(
    select(fromOmgevingsnormen.selectOmgevingsnormenVM)
  );

  public readonly getOmgevingswaardenStatus$ = this.store.pipe(select(fromOmgevingswaarden.getOmgevingswaardenStatus));
  public readonly getOmgevingswaarden$: Observable<OmgevingsnormenVM[]> = this.store.pipe(
    select(fromOmgevingswaarden.selectOmgevingswaardenVM)
  );

  public readonly getGebiedsaanwijzingenStatus$ = this.store.pipe(
    select(fromGebiedsaanwijzingen.getGebiedsaanwijzingenStatus)
  );
  public readonly getGebiedsaanwijzingen$: Observable<GebiedsaanwijzingenVM[]> = this.store.pipe(
    select(fromGebiedsaanwijzingen.selectGebiedsaanwijzingenVM)
  );

  constructor(private store: Store<State>) {}

  public loadOmgevingsnormen(): void {
    this.store.dispatch(OmgevingsnormenActions.loadOmgevingsnormen({ omgevingsnormen: [] }));
  }

  public loadOmgevingswaarden(): void {
    this.store.dispatch(OmgevingswaardenActions.loadOmgevingswaarden({ omgevingswaarden: [] }));
  }

  public loadGebiedsaanwijzingen(): void {
    this.store.dispatch(GebiedsaanwijzingenActions.loadGebiedsaanwijzingen({ gebiedsaanwijzingen: {} }));
  }
}
