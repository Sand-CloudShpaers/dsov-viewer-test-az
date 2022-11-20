import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { State } from './index';
import * as LayoutActions from '~viewer/documenten/+state/layout.actions';
import { AnnotationId, AnnotationVM } from '~viewer/documenten/types/annotation';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { GebiedsaanwijzingenVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';
import {
  AanduidingLocatiesVM,
  ActiviteitLocatieaanduidingenGroepVM,
  ActiviteitLocatieaanduidingVM,
} from '~viewer/gebieds-info/types/gebieds-info.model';
import { OmgevingsnormenVM } from '~viewer/normen/types/omgevingsnormenVM';
import * as AanduidingLocatiesActions from './aanduiding-locaties/aanduiding-locaties.actions';
import { AnnotatieHoofdlijnenVM } from '~viewer/annotaties/types/hoofdlijnen';
import { LocatieVM } from '~viewer/annotaties/types/locatieVM';
import { KaartVM } from '~viewer/annotaties/types/kaartenVM';
import { AnnotatiesStoreModule } from './annotaties-store.module';
import * as fromAnnotaties from './annotaties.selectors';
import * as AnnotatiesActions from './annotaties.actions';
import { BestemmingsplanFeatureGroupVM } from '../types/bestemmingsplan-features';

@Injectable({
  providedIn: AnnotatiesStoreModule,
})
export class AnnotatiesFacade {
  constructor(private store: Store<State>) {}

  public getIdealisatieById$(annotationId: AnnotationId): Observable<boolean> {
    return this.store.pipe(select(fromAnnotaties.getIdealisatieById(annotationId)));
  }

  public getLocatiesById$(annotationId: AnnotationId): Observable<LocatieVM[]> {
    return this.store.pipe(select(fromAnnotaties.getLocatiesById(annotationId)));
  }

  public getactiviteitLocatieaanduidingenById$(
    annotationId: AnnotationId
  ): Observable<ActiviteitLocatieaanduidingenGroepVM[]> {
    return this.store.pipe(select(fromAnnotaties.selectActiviteitLocatieaanduidingenById(annotationId)));
  }

  public getAanduidingLocatiesByIds$(ids: string[]): Observable<AanduidingLocatiesVM[]> {
    return this.store.pipe(select(fromAnnotaties.getAanduidingLocatiesByIds(ids)));
  }

  public getAnnotatiesStatusById$(annotationId: AnnotationId): Observable<DerivedLoadingState> {
    return this.store.pipe(select(fromAnnotaties.getAnnotatiesStatusById(annotationId)));
  }

  public getGebiedsaanwijzingenById$(annotationId: AnnotationId): Observable<GebiedsaanwijzingenVM[]> {
    return this.store.pipe(select(fromAnnotaties.selectGebiedsaanwijzingenById(annotationId)));
  }

  public getOmgevingswaardenById$(annotationId: AnnotationId): Observable<OmgevingsnormenVM[]> {
    return this.store.pipe(select(fromAnnotaties.selectOmgevingswaardenById(annotationId)));
  }

  public getOmgevingsnormenById$(
    annotationId: AnnotationId,
    documentViewContext: DocumentViewContext
  ): Observable<OmgevingsnormenVM[]> {
    return this.store.pipe(select(fromAnnotaties.selectOmgevingsnormenById(annotationId, documentViewContext)));
  }

  public getHoofdlijnenById$(annotationId: AnnotationId): Observable<AnnotatieHoofdlijnenVM[]> {
    return this.store.pipe(select(fromAnnotaties.getHoofdlijnenById(annotationId)));
  }

  public getKaartenById$(annotationId: AnnotationId): Observable<KaartVM[]> {
    return this.store.pipe(select(fromAnnotaties.getKaartenById(annotationId)));
  }

  public getBestemmingsplanFeaturesById$(annotationId: AnnotationId): Observable<BestemmingsplanFeatureGroupVM[]> {
    return this.store.pipe(select(fromAnnotaties.getBestemmingsplanFeaturesById(annotationId)));
  }

  public loadAnnotation(annotation: AnnotationVM, documentId: string): void {
    this.store.dispatch(LayoutActions.loadAnnotaties({ annotation, documentId }));
  }

  public activiteitLocatieaanduidingenExpanded(activiteitLocatieaanduiding: ActiviteitLocatieaanduidingVM): void {
    this.store.dispatch(
      AanduidingLocatiesActions.load({
        id: activiteitLocatieaanduiding.identificatie,
        href: activiteitLocatieaanduiding.kwalificeertHref,
      })
    );
  }

  public resetState(): void {
    this.store.dispatch(AnnotatiesActions.resetState());
  }
}
