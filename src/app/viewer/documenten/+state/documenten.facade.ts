import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as ThemasActions from '~viewer/documenten/+state/themas/themas.actions';
import * as HoofdlijnenActions from '~viewer/documenten/+state/hoofdlijnen/hoofdlijnen.actions';
import * as RegeltekstActions from '~viewer/documenten/+state/regeltekst/regeltekst.actions';
import * as DivisieannotatieActions from '~viewer/documenten/+state/divisieannotatie/divisieannotatie.actions';
import {
  loadDocumentStructuurForSelectedDocument,
  loadIhrDocumentStructuur,
} from './document-structuur/document-structuur.actions';
import * as BekendmakingenActions from './bekendmakingen/bekendmakingen.actions';
import * as KaartenImroActions from './kaarten-imro/kaarten-imro.actions';
import * as GerelateerdePlannenActions from './gerelateerde-plannen/gerelateerde-plannen.actions';
import * as fromDocumentStructuur from './document-structuur/document-structuur.selectors';
import * as fromDocumentenVM from './document-vm.selectors';
import { DocumentenStoreModule } from './documenten-store.module';
import * as fromDocumenten from './documenten/documenten.selectors';
import * as fromHoofdlijnen from './hoofdlijnen/hoofdlijnen.selectors';
import * as fromInhoud from './inhoud/inhoud.selectors';
import * as fromThemas from './themas/themas.selectors';
import * as fromKaarten from './kaarten/kaarten.selectors';
import * as KaartenActions from './kaarten/kaarten.actions';
import * as DocumentLocatieActions from './document-locatie/document-locatie.actions';
import * as DocumentVersiesActions from './document-versies/document-versies.actions';
import * as fromBekendmakingen from './bekendmakingen/bekendmakingen.selectors';
import * as fromKaartenImro from './kaarten-imro/kaarten-imro.selectors';
import * as fromGerelateerdePlannen from './gerelateerde-plannen/gerelateerde-plannen.selectors';
import * as fromStructuurelementenFilters from './structuurelement-filter/structuurelement-filter.selectors';
import { State } from './index';
import * as LayoutActions from './layout.actions';
import { Observable, of } from 'rxjs';
import * as DocumentenActions from '~viewer/documenten/+state/documenten/documenten.actions';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import * as StructuurelementFilterActions from '~viewer/documenten/+state/structuurelement-filter/structuurelement-filter.actions';
import { StructuurElementFilter } from '~viewer/documenten/+state/structuurelement-filter/structuurelement-filter.model';
import {
  Breadcrumb,
  DocumentBodyElement,
  DocumentStructuurVM,
  DocumentVM,
  InhoudVM,
} from '~viewer/documenten/types/documenten.model';
import { Thema } from '~ozon-model/thema';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { DocumentSubPage, DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { sortByKey } from '~general/utils/group-by.utils';
import { PlanHeeftOnderdelenInner } from '~ihr-model/planHeeftOnderdelenInner';
import { ApiSource } from '~model/internal/api-source';
import { ImroKaartStyleConfig } from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.model';
import { BekendmakingVM } from '~viewer/documenten/components/bekendmakingen/bekendmakingen.model';
import { AnnotationVM } from '../types/annotation';
import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { HoofdlijnVM } from './hoofdlijnen/hoofdlijnen.model';
import { KaartVM } from '~viewer/annotaties/types/kaartenVM';
import { RegelgevingtypeFilter } from '~viewer/filter/types/filter-options';
import {
  getOntwerpVersies,
  getOntwerpVersiesStatus,
  getVastgesteldVersies,
  getVastgesteldVersiesStatus,
} from './document-versies/document-versies.selectors';
import { TimeTravelDates } from '~model/time-travel-dates';
import { DocumentVersieVM } from '../types/document-versie';

@Injectable({
  providedIn: DocumentenStoreModule,
})
export class DocumentenFacade {
  public readonly documentenStatus$ = this.store.pipe(select(fromDocumenten.getDocumentenStatus));
  public readonly currentDocumentDto$ = this.store.pipe(select(fromDocumenten.selectCurrentDocumentDto));
  public readonly currentElementId$ = this.store.pipe(select(fromDocumenten.selectCurrentElementId));
  public readonly hoofdlijnenStatus$ = this.store.pipe(select(fromHoofdlijnen.getHoofdlijnenStatus));
  public readonly themasStatus$ = this.store.pipe(select(fromThemas.getThemaStatus));
  public readonly gerelateerdePlannenStatus$ = this.store.pipe(
    select(fromGerelateerdePlannen.getGerelateerdePlannenStatus)
  );

  constructor(private store: Store<State>) {}

  public documentVM$(documentId: string): Observable<DocumentVM> {
    return this.store.pipe(select(fromDocumentenVM.getDocumentenVM(documentId)));
  }

  public apiSource$(documentId: string): Observable<ApiSource> {
    return this.store.pipe(select(fromDocumentenVM.getDocumentApiSource(documentId)));
  }

  public documentStatus$(documentId: string): Observable<DerivedLoadingState> {
    return this.store.pipe(select(fromDocumenten.selectDocumentStatus(documentId)));
  }

  public readonly documentStructuurStatus$ = (documentId: string): Observable<DerivedLoadingState> =>
    this.store.pipe(select(fromDocumentStructuur.getDocumentStructuurStatus(documentId)));

  public documentStructuurVM$(
    documentId: string,
    documentViewContext: DocumentViewContext,
    documentSubPagePath: DocumentSubPagePath,
    expandedView: boolean
  ): Observable<DocumentStructuurVM> {
    return this.store.pipe(
      select(
        fromDocumentStructuur.getDocumentStructuurVM(documentId, documentViewContext, documentSubPagePath, expandedView)
      )
    );
  }

  public versiesVastgesteldStatus$(): Observable<DerivedLoadingState> {
    return this.store.pipe(select(getVastgesteldVersiesStatus()));
  }

  public versiesVastgesteld$(): Observable<DocumentVersieVM[]> {
    return this.store.pipe(select(getVastgesteldVersies()));
  }

  public versiesOntwerpStatus$(): Observable<DerivedLoadingState> {
    return this.store.pipe(select(getOntwerpVersiesStatus()));
  }

  public versiesOntwerp$(): Observable<DocumentVersieVM[]> {
    return this.store.pipe(select(getOntwerpVersies()));
  }

  public documentSubPages$(documentId: string): Observable<DocumentSubPage[]> {
    return this.store.pipe(select(fromDocumentenVM.getDocumentenSubPages(documentId)));
  }

  public filterTabRouterLink$(documentId: string): Observable<string> {
    return this.store.pipe(select(fromDocumentenVM.getDocumentenVMFilterTabRouterLink(documentId)));
  }

  public inhoud$(documentId: string): Observable<InhoudVM> {
    return this.store.pipe(select(fromInhoud.selectInhoud(documentId)));
  }

  public bekendmakingen$(documentId: string): Observable<BekendmakingVM[]> {
    return this.store.pipe(select(fromBekendmakingen.selectBekendmakingenByDocumentId(documentId)));
  }

  public imroKaartStyleConfigs$(documentId: string): Observable<ImroKaartStyleConfig[]> {
    return this.store.pipe(select(fromKaartenImro.selectStyleConfigs(documentId)));
  }

  public gerelateerdePlannen$(documentId: string): Observable<DocumentVM[]> {
    return this.store.pipe(select(fromGerelateerdePlannen.getGerelateerdePlannen(documentId)));
  }

  public gerelateerdVanuit$(documentId: string): Observable<DocumentVM[]> {
    return this.store.pipe(select(fromGerelateerdePlannen.getGerelateerdVanuit(documentId)));
  }

  public getDossierPlannen$(documentId: string): Observable<DocumentVM[]> {
    return this.store.pipe(select(fromGerelateerdePlannen.getDossierPlannen(documentId)));
  }

  public inhoudBySubpage$(documentId: string, subpage: DocumentSubPagePath): Observable<PlanHeeftOnderdelenInner> {
    return this.store.pipe(select(fromInhoud.selectInhoudBySubpage(documentId, subpage)));
  }

  public loadDocumentLocatie(documentId: string, href: string): void {
    this.store.dispatch(DocumentLocatieActions.load({ documentId, href }));
  }

  public loadDocumentVersies(documentId: string, isOntwerp: boolean): void {
    this.store.dispatch(DocumentVersiesActions.load({ documentId, isOntwerp }));
  }

  public resetDocumentVersies(): void {
    this.store.dispatch(DocumentVersiesActions.reset());
  }

  public loadKaarten(documentId: string): void {
    this.store.dispatch(KaartenActions.checkLoadKaarten({ documentId }));
  }

  public kaartenStatus$(documentId: string): Observable<DerivedLoadingState> {
    return this.store.pipe(select(fromKaarten.selectKaartenStatusByDocumentId(documentId)));
  }

  public kaartenByDocumentId$(documentId: string): Observable<KaartVM[]> {
    return this.store.pipe(select(fromKaarten.selectKaartenByDocumentId(documentId)));
  }

  public annotation$(
    documentId: string,
    element: DocumentBodyElement,
    regelgevingtypes: RegelgevingtypeFilter[]
  ): Observable<AnnotationVM> {
    if (element.apiSource === ApiSource.OZON) {
      return this.store.pipe(select(fromDocumentenVM.selectAnnotationVM(documentId, element.id, regelgevingtypes)));
    } else {
      return of(element.annotation);
    }
  }

  public getHoofdlijnenByDocumentId$(documentId: string): Observable<Record<string, HoofdlijnVM[]>> {
    return this.store.pipe(select(fromHoofdlijnen.selectHoofdlijnenByDocumentId(documentId)));
  }

  public sortedThemasByDocumentId$(documentId: string): Observable<Thema[]> {
    return this.store.pipe(
      select(fromThemas.selectThemasByDocumentId(documentId)),
      map(themas => sortByKey<Thema>(themas, 'waarde'))
    );
  }

  public getTijdelijkeDelen$(documentId: string): Observable<DocumentVM[]> {
    return this.store.pipe(
      select(fromDocumentenVM.getDocumentenVM(documentId)),
      map(result => result?.tijdelijkeDelen)
    );
  }

  public readonly structuurElementFilter$ = (documentId: string): Observable<StructuurElementFilter> =>
    this.store.pipe(select(fromStructuurelementenFilters.getFilterByDocumentId(documentId)));

  public readonly structuurElementFilterStatus$ = (documentId: string): Observable<DerivedLoadingState> =>
    this.store.pipe(select(fromStructuurelementenFilters.getStatus(documentId)));

  public loadDocument(document: DocumentDto, setAsSelected: boolean, timeTravelDates?: TimeTravelDates): void {
    this.store.dispatch(DocumentenActions.loadDocument({ document, setAsSelected, timeTravelDates }));
  }

  public loadDocumentStructuurForSelectedDocument(
    documentId: string,
    documentSubPagePaths?: DocumentSubPagePath[]
  ): void {
    this.store.dispatch(loadDocumentStructuurForSelectedDocument({ id: documentId, documentSubPagePaths }));
  }

  public loadIHRDocumentStructuurForSelectedTekst(documentId: string, parentId: string): void {
    this.store.dispatch(loadIhrDocumentStructuur({ id: documentId, parentId: parentId }));
  }

  public loadIHRBekendmakingen(documentId: string): void {
    this.store.dispatch(BekendmakingenActions.loadIhrBekendmakingen({ documentId }));
  }

  public loadImroKaartStyleConfigs(documentId: string): void {
    this.store.dispatch(KaartenImroActions.loadStyleConfigs({ documentIds: [documentId] }));
  }

  public loadGerelateerdePlannen(documentId: string): void {
    this.store.dispatch(GerelateerdePlannenActions.loadGerelateerdePlannen({ documentId }));
  }

  public collapseAllElements(): void {
    this.store.dispatch(LayoutActions.reset());
  }

  public collapseElementChange(open: boolean, documentId: string, elementId: string): void {
    this.store.dispatch(
      open
        ? LayoutActions.collapseElementOpen({
            documentId,
            elementId,
          })
        : LayoutActions.collapseElementClose({ documentId, elementId })
    );
  }

  public toggleAnnotation(documentId: string, elementId: string): void {
    this.store.dispatch(LayoutActions.toggleElementAnnotation({ documentId, elementId }));
  }

  public resetSelectedDocument(): void {
    this.store.dispatch(DocumentenActions.resetSelectedDocument());
  }

  public setSelectedElement(id: string): void {
    this.store.dispatch(DocumentenActions.setSelectedElement({ id }));
  }

  public resetSelectedElement(): void {
    this.store.dispatch(DocumentenActions.resetSelectedElement());
  }

  public collapseSelectedElementTree(documentId: string, elementId: string, breadcrumbs: Breadcrumb[]): void {
    this.collapseAllElements();
    this.setSelectedElement(elementId);

    breadcrumbs.forEach(item => {
      this.collapseElementChange(true, documentId, item.id);
    });
  }

  public loadRegeltekst(
    documentId: string,
    documentstructuurelementId: string,
    regeltekstHref: string,
    isOntwerp: boolean
  ): void {
    this.store.dispatch(
      RegeltekstActions.openedRegeltekstForElement({
        documentId,
        documentstructuurelementId,
        regeltekstHref,
        isOntwerp,
      })
    );
  }

  public loadDivisieAnnotatie(
    documentId: string,
    documentstructuurelementId: string,
    href: string,
    isOntwerp: boolean
  ): void {
    this.store.dispatch(
      DivisieannotatieActions.openedDivisieannotatieForElement({
        documentId,
        documentstructuurelementId,
        href,
        isOntwerp,
      })
    );
  }

  public setStructuurelementFilter(filter: StructuurElementFilter): void {
    this.collapseAllElements();
    this.store.dispatch(StructuurelementFilterActions.removeFilters());
    this.store.dispatch(StructuurelementFilterActions.loadFilter(filter));
  }

  public removeStructuurelementFilter(id: string): void {
    this.collapseAllElements();
    this.store.dispatch(StructuurelementFilterActions.removeFilter({ id }));
  }

  public loadThemas(document: DocumentDto): void {
    this.store.dispatch(ThemasActions.load({ document }));
  }

  public loadHoofdlijnen(document: DocumentDto): void {
    this.store.dispatch(HoofdlijnenActions.loadHoofdlijnen({ document }));
  }
}
