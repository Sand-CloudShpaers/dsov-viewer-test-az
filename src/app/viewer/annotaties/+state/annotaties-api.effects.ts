import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { State } from './index';
import * as fromAnnotaties from './annotaties.selectors';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';
import * as LayoutActions from '~viewer/documenten/+state/layout.actions';
import * as ActiviteitLocatieaanduidingenActions from './activiteit-locatieaanduidingen/activiteit-locatieaanduidingen.actions';
import * as GebiedsaanwijzingenActions from './gebiedsaanwijzingen/gebiedsaanwijzingen.actions';
import * as HoofdlijnenActions from './hoofdlijnen/hoofdlijnen.actions';
import * as KaartenActions from './kaarten/kaarten.actions';
import * as LocatiesActions from './locaties/locaties.actions';
import * as AanduidingLocatiesActions from './aanduiding-locaties/aanduiding-locaties.actions';
import * as OmgevingsnormenActions from './omgevingsnormen/omgevingsnormen.actions';
import * as OmgevingswaardenActions from './omgevingswaarden/omgevingswaarden.actions';
import * as IdealisatieActions from './idealisatie/idealisatie.actions';
import * as BestemmingsplanFeaturesActions from './bestemminsplan-features/bestemmingsplan-features.actions';
import { Hoofdlijnen } from '~ozon-model/hoofdlijnen';
import { Locaties } from '~ozon-model/locaties';
import { Omgevingsnormen } from '~ozon-model/omgevingsnormen';
import { Omgevingswaarden } from '~ozon-model/omgevingswaarden';
import { Gebiedsaanwijzingen } from '~ozon-model/gebiedsaanwijzingen';
import { OntwerpLocaties } from '~ozon-model/ontwerpLocaties';
import { OntwerpOmgevingsnormen } from '~ozon-model/ontwerpOmgevingsnormen';
import { OntwerpOmgevingswaarden } from '~ozon-model/ontwerpOmgevingswaarden';
import { OntwerpGebiedsaanwijzingen } from '~ozon-model/ontwerpGebiedsaanwijzingen';
import { OntwerpHoofdlijnen } from '~ozon-model/ontwerpHoofdlijnen';
import { Kaarten } from '~ozon-model/kaarten';
import { OntwerpKaarten } from '~ozon-model/ontwerpKaarten';
import { IhrProvider } from '~providers/ihr.provider';
import { SelectionObjectType } from '~store/common/selection/selection.model';

@Injectable()
export class AnnotatiesApiEffects {
  public conditionalLoadActiviteitLocatieaanduidingen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LayoutActions.loadAnnotaties),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(
            this.store.select(fromAnnotaties.getActiviteitLocatieaanduidingenById(action.annotation.annotationId))
          )
        )
      ),
      filter(
        ([action, fromStore]) =>
          !fromStore?.data &&
          (!!action.annotation.vastgesteld?.activiteitenHref || !!action.annotation.ontwerp?.activiteitenHref)
      ),
      map(([action, _fromStore]) =>
        ActiviteitLocatieaanduidingenActions.loading({
          annotationId: action.annotation.annotationId,
        })
      )
    )
  );

  public loadActiviteitLocatieaanduidingen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActiviteitLocatieaanduidingenActions.loading),
      mergeMap(({ annotationId }) =>
        forkJoin([
          this.omgevingsDocumentService.getActiviteitLocatieaanduidingen$(annotationId.identificatie),
          this.omgevingsDocumentService.getOntwerpActiviteitLocatieaanduidingen$(annotationId.technischId),
        ]).pipe(
          map(response =>
            ActiviteitLocatieaanduidingenActions.loadSuccess({
              annotationId,
              vastgesteld: response[0],
              ontwerp: response[1],
            })
          ),
          catchError(error => of(ActiviteitLocatieaanduidingenActions.loadError({ annotationId, error })))
        )
      )
    )
  );

  public expandActiviteitLocatieaanduidingen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AanduidingLocatiesActions.load),
      concatMap(action =>
        of(action).pipe(withLatestFrom(this.store.select(fromAnnotaties.getAanduidingLocatiesById(action.id))))
      ),
      filter(([_, fromStore]) => !fromStore),
      map(([action, _]) => AanduidingLocatiesActions.loading({ id: action.id, href: action.href }))
    )
  );

  public loadAanduidingenLocaties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AanduidingLocatiesActions.loading),
      mergeMap(action =>
        this.omgevingsDocumentService.get$<Locaties | OntwerpLocaties>(action.href).pipe(
          map(response =>
            AanduidingLocatiesActions.loadSuccess({
              locaties:
                (response as Locaties)?._embedded?.locaties ||
                (response as OntwerpLocaties)?._embedded?.ontwerpLocaties,
              id: action.id,
            })
          ),
          catchError(error => of(AanduidingLocatiesActions.loadError({ id: action.id, error })))
        )
      )
    )
  );

  public conditionalLoadGebiedsaanwijzingen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LayoutActions.loadAnnotaties),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromAnnotaties.getGebiedsaanwijzingenById(action.annotation.annotationId)))
        )
      ),
      filter(
        ([action, fromStore]) =>
          !fromStore?.data &&
          (!!action.annotation.vastgesteld?.gebiedsaanwijzingenHref ||
            !!action.annotation.ontwerp?.gebiedsaanwijzingenHref)
      ),
      map(([action, _fromStore]) =>
        GebiedsaanwijzingenActions.loading({
          annotationId: action.annotation.annotationId,
          href: action.annotation.vastgesteld?.gebiedsaanwijzingenHref,
          ontwerpHref: action.annotation.ontwerp?.gebiedsaanwijzingenHref,
        })
      )
    )
  );

  public loadGebiedsaanwijzingen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GebiedsaanwijzingenActions.loading),
      mergeMap(({ href, ontwerpHref, annotationId }) =>
        forkJoin([
          this.omgevingsDocumentService.get$<Gebiedsaanwijzingen>(href),
          this.omgevingsDocumentService.get$<OntwerpGebiedsaanwijzingen>(ontwerpHref),
        ]).pipe(
          map(response =>
            GebiedsaanwijzingenActions.loadSuccess({ annotationId, vastgesteld: response[0], ontwerp: response[1] })
          ),
          catchError(error => of(GebiedsaanwijzingenActions.loadError({ annotationId, error })))
        )
      )
    )
  );

  public conditionalLoadHoofdlijnen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LayoutActions.loadAnnotaties),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromAnnotaties.getHoofdlijnenById(action.annotation.annotationId)))
        )
      ),
      filter(
        ([action, fromStore]) =>
          !fromStore?.length &&
          (!!action.annotation.vastgesteld?.hoofdlijnenHref || !!action.annotation.ontwerp?.hoofdlijnenHref)
      ),
      map(([action, _]) =>
        HoofdlijnenActions.loading({
          annotationId: action.annotation.annotationId,
          href: action.annotation.vastgesteld?.hoofdlijnenHref,
          ontwerpHref: action.annotation.ontwerp?.hoofdlijnenHref,
        })
      )
    )
  );

  public loadHoofdlijnen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HoofdlijnenActions.loading),
      mergeMap(({ href, ontwerpHref, annotationId }) =>
        forkJoin([
          this.omgevingsDocumentService.get$<Hoofdlijnen>(href),
          this.omgevingsDocumentService.get$<OntwerpHoofdlijnen>(ontwerpHref),
        ]).pipe(
          map(response =>
            HoofdlijnenActions.loadSuccess({ annotationId, vastgesteld: response[0], ontwerp: response[1] })
          ),
          catchError(error => of(HoofdlijnenActions.loadError({ annotationId, error })))
        )
      )
    )
  );

  public conditionalLoadLocaties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LayoutActions.loadAnnotaties),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromAnnotaties.getLocatiesById(action.annotation.annotationId)))
        )
      ),
      filter(
        ([action, fromStore]) =>
          !fromStore?.length &&
          (!!action.annotation.vastgesteld?.locatiesHref || !!action.annotation.ontwerp?.locatiesHref)
      ),
      map(([action, _]) =>
        LocatiesActions.loading({
          annotationId: action.annotation.annotationId,
          href: action.annotation.vastgesteld?.locatiesHref,
          ontwerpHref: action.annotation.ontwerp?.locatiesHref,
        })
      )
    )
  );

  public loadLocaties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocatiesActions.loading),
      mergeMap(({ href, ontwerpHref, annotationId }) =>
        forkJoin([
          this.omgevingsDocumentService.get$<Locaties>(href),
          this.omgevingsDocumentService.get$<OntwerpLocaties>(ontwerpHref),
        ]).pipe(
          map(response =>
            LocatiesActions.loadSuccess({ annotationId, vastgesteld: response[0], ontwerp: response[1] })
          ),
          catchError(error => of(LocatiesActions.loadError({ annotationId, error })))
        )
      )
    )
  );

  public conditionalLoadOmgevingsnormen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LayoutActions.loadAnnotaties),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromAnnotaties.getOmgevingsnormenById(action.annotation.annotationId)))
        )
      ),
      filter(
        ([action, fromStore]) =>
          !fromStore?.data &&
          (!!action.annotation.vastgesteld?.omgevingsnormenHref || !!action.annotation.ontwerp?.omgevingsnormenHref)
      ),
      map(([action, _]) =>
        OmgevingsnormenActions.loading({
          annotationId: action.annotation.annotationId,
          href: action.annotation.vastgesteld?.omgevingsnormenHref,
          ontwerpHref: action.annotation.ontwerp?.omgevingsnormenHref,
        })
      )
    )
  );

  public loadOmgevingsnormen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OmgevingsnormenActions.loading),
      mergeMap(({ href, ontwerpHref, annotationId }) =>
        forkJoin([
          this.omgevingsDocumentService.get$<Omgevingsnormen>(href),
          this.omgevingsDocumentService.get$<OntwerpOmgevingsnormen>(ontwerpHref),
        ]).pipe(
          map(response =>
            OmgevingsnormenActions.loadSuccess({ annotationId, vastgesteld: response[0], ontwerp: response[1] })
          ),
          catchError(error => of(OmgevingsnormenActions.loadError({ annotationId, error })))
        )
      )
    )
  );

  public conditionalLoadOmgevingswaarden$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LayoutActions.loadAnnotaties),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromAnnotaties.getOmgevingswaardenById(action.annotation.annotationId)))
        )
      ),
      filter(
        ([action, fromStore]) =>
          !fromStore?.data &&
          (!!action.annotation.vastgesteld?.omgevingswaardenHref || !!action.annotation.ontwerp?.omgevingswaardenHref)
      ),
      map(([action, _]) =>
        OmgevingswaardenActions.loading({
          annotationId: action.annotation.annotationId,
          href: action.annotation.vastgesteld?.omgevingswaardenHref,
          ontwerpHref: action.annotation.ontwerp?.omgevingswaardenHref,
        })
      )
    )
  );

  public loadOmgevingswaarden$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OmgevingswaardenActions.loading),
      mergeMap(({ href, ontwerpHref, annotationId }) =>
        forkJoin([
          this.omgevingsDocumentService.get$<Omgevingswaarden>(href),
          this.omgevingsDocumentService.get$<OntwerpOmgevingswaarden>(ontwerpHref),
        ]).pipe(
          map(response =>
            OmgevingswaardenActions.loadSuccess({ annotationId, vastgesteld: response[0], ontwerp: response[1] })
          ),
          catchError(error => of(OmgevingswaardenActions.loadError({ annotationId, error })))
        )
      )
    )
  );

  public conditionalKaarten$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LayoutActions.loadAnnotaties),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromAnnotaties.getKaartenById(action.annotation.annotationId)))
        )
      ),
      filter(
        ([action, fromStore]) =>
          !fromStore?.length &&
          (!!action.annotation.vastgesteld?.kaartenHref || !!action.annotation.ontwerp?.kaartenHref)
      ),
      map(([action, _]) =>
        KaartenActions.loading({
          annotationId: action.annotation.annotationId,
          href: action.annotation.vastgesteld?.kaartenHref,
          ontwerpHref: action.annotation.ontwerp?.kaartenHref,
        })
      )
    )
  );

  public loadKaarten$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KaartenActions.loading),
      mergeMap(({ href, ontwerpHref, annotationId }) =>
        forkJoin([
          this.omgevingsDocumentService.get$<Kaarten>(href),
          this.omgevingsDocumentService.get$<OntwerpKaarten>(ontwerpHref),
        ]).pipe(
          map(response => KaartenActions.loadSuccess({ annotationId, vastgesteld: response[0], ontwerp: response[1] })),
          catchError(error => of(KaartenActions.loadError({ annotationId, error })))
        )
      )
    )
  );

  public loadIdealisatie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LayoutActions.loadAnnotaties),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromAnnotaties.getIdealisatieById(action.annotation.annotationId)))
        )
      ),
      filter(([action, fromStore]) => !fromStore && !!action.annotation.vastgesteld?.idealisatieHref),
      map(([action, _fromStore]) =>
        IdealisatieActions.loading({
          annotationId: action.annotation.annotationId,
          href: action.annotation.vastgesteld?.idealisatieHref,
        })
      )
    )
  );

  public loadingIdealisatie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IdealisatieActions.loading),
      mergeMap(({ annotationId, href }) =>
        this.omgevingsDocumentService.get$<Locaties>(href).pipe(
          map(response => IdealisatieActions.loadSuccess({ annotationId, locaties: response })),
          catchError(error => of(IdealisatieActions.loadError({ annotationId, error })))
        )
      )
    )
  );

  public conditionalLoadBestemmingsplanFeatures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LayoutActions.loadAnnotaties),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(
            this.store.select(fromAnnotaties.getBestemmingsplanFeaturesById(action.annotation.annotationId))
          )
        )
      ),
      filter(
        ([action, fromStore]) => action.annotation.vastgesteld?.features?.some(x => x.hrefs?.length) && !fromStore
      ),
      map(([action, _fromStore]) =>
        BestemmingsplanFeaturesActions.loading({
          annotationId: action.annotation.annotationId,
          documentId: action.documentId,
          featureGroups: action.annotation.vastgesteld.features,
        })
      )
    )
  );

  public loadBestemmingsplanFeatures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BestemmingsplanFeaturesActions.loading),
      mergeMap(action => {
        let features: { objectType: SelectionObjectType; href: string }[] = [];
        action.featureGroups.forEach(group => {
          features = features.concat(
            group.hrefs.map(href => ({
              objectType: group.objectType,
              href,
            }))
          );
        });

        return forkJoin(features.map(item => this.ihrProvider.fetchBestemmingsplanFeature$(item.href))).pipe(
          map(response =>
            BestemmingsplanFeaturesActions.loadSuccess({
              annotationId: action.annotationId,
              features: response.map((item, index) => ({
                objectType: features[index].objectType,
                documentId: action.documentId,
                feature: item,
              })),
            })
          ),
          catchError(error =>
            of(BestemmingsplanFeaturesActions.loadError({ annotationId: action.annotationId, error }))
          )
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private omgevingsDocumentService: OmgevingsDocumentService,
    private ihrProvider: IhrProvider,
    private store: Store<State>
  ) {}
}
