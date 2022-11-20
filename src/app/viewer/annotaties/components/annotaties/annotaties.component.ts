import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { GebiedsaanwijzingenVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';
import { OmgevingsnormenVM } from '~viewer/normen/types/omgevingsnormenVM';
import { ActiviteitLocatieaanduidingenGroepVM } from '~viewer/gebieds-info/types/gebieds-info.model';
import { AnnotatieHoofdlijnenVM } from '~viewer/annotaties/types/hoofdlijnen';
import { AnnotatiesFacade } from '~viewer/annotaties/+state/annotaties.facade';
import { AnnotationVM } from '~viewer/documenten/types/annotation';
import { LocatieVM } from '~viewer/annotaties/types/locatieVM';
import { KaartVM } from '~viewer/annotaties/types/kaartenVM';
import { Selection, SelectionObjectType } from '~store/common/selection/selection.model';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { FilterOptions } from '~viewer/filter/types/filter-options';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { BestemmingsplanFeatureGroupVM } from '~viewer/annotaties/types/bestemmingsplan-features';
import { DocumentBodyElement, DocumentBodyElementType } from '~viewer/documenten/types/documenten.model';

@Component({
  selector: 'dsov-annotaties',
  templateUrl: './annotaties.component.html',
  styleUrls: ['./annotaties.component.scss'],
})
export class AnnotatiesComponent implements OnInit {
  @Input()
  public annotation: AnnotationVM;
  @Input()
  public filterOptions: FilterOptions;
  @Input()
  public element: DocumentBodyElement;
  @Input()
  public documentViewContext: DocumentViewContext;
  @Input()
  public documentId: string;
  @Input()
  public showAnnotation: boolean;

  public idealisatie$: Observable<boolean>;
  public locaties$: Observable<LocatieVM[]>;
  public activiteitLocatieaanduidingen$: Observable<ActiviteitLocatieaanduidingenGroepVM[]>;
  public gebiedsaanwijzingen$: Observable<GebiedsaanwijzingenVM[]>;
  public omgevingswaarden$: Observable<OmgevingsnormenVM[]>;
  public omgevingsnormen$: Observable<OmgevingsnormenVM[]>;
  public hoofdlijnen$: Observable<AnnotatieHoofdlijnenVM[]>;
  public kaarten$: Observable<KaartVM[]>;
  public annotatiesStatus$: Observable<DerivedLoadingState>;
  public SelectionObjectType = SelectionObjectType;

  public currentSelections$: Observable<Selection[]>;

  public bestemmingsplanFeatures$: Observable<BestemmingsplanFeatureGroupVM[]>;
  public NormTypeEnum = NormType;

  constructor(private annotatiesFacade: AnnotatiesFacade, private selectionFacade: SelectionFacade) {}

  public ngOnInit(): void {
    const id = this.annotation.annotationId;
    this.annotatiesStatus$ = this.annotatiesFacade.getAnnotatiesStatusById$(id);
    this.idealisatie$ = this.annotatiesFacade.getIdealisatieById$(id);
    this.locaties$ = this.annotatiesFacade.getLocatiesById$(id);
    this.activiteitLocatieaanduidingen$ = this.annotatiesFacade.getactiviteitLocatieaanduidingenById$(id);
    this.gebiedsaanwijzingen$ = this.annotatiesFacade.getGebiedsaanwijzingenById$(id);
    this.omgevingswaarden$ = this.annotatiesFacade.getOmgevingswaardenById$(id);
    this.omgevingsnormen$ = this.annotatiesFacade.getOmgevingsnormenById$(id, this.documentViewContext);
    this.hoofdlijnen$ = this.annotatiesFacade.getHoofdlijnenById$(id);
    this.kaarten$ = this.annotatiesFacade.getKaartenById$(id);
    this.bestemmingsplanFeatures$ = this.annotatiesFacade.getBestemmingsplanFeaturesById$(id);
    this.currentSelections$ = this.selectionFacade.getSelections$;

    this.annotatiesFacade.loadAnnotation(this.annotation, this.documentId);
  }

  public getThemas(): string {
    return this.annotation?.themas?.map(thema => thema.naam).join(', ');
  }

  private isArtikelOrLid(type: DocumentBodyElementType): boolean {
    return [DocumentBodyElementType.ARTIKEL, DocumentBodyElementType.LID].includes(type);
  }

  public getSubtitle(element: DocumentBodyElement): string {
    return this.isArtikelOrLid(element?.type)
      ? `Dit ${element.type.toLowerCase()} geldt in`
      : 'Deze tekst is van toepassing in';
  }

  public getKaartenText(type: DocumentBodyElementType, kaarten: KaartVM[]): string {
    const textTypeString = this.isArtikelOrLid(type) ? `dit ${type.toLowerCase()}` : 'deze tekst';
    const kaartenText = kaarten.length === 1 ? 'hoort de kaart' : 'horen de kaarten';
    return `Bij ${textTypeString} ${kaartenText}`;
  }

  public trackByBestemmingsplanFeature(_index: number, item: BestemmingsplanFeatureGroupVM): string {
    return item.id;
  }

  public trackByKaart(_index: number, item: KaartVM): string {
    return item.identificatie;
  }
}
