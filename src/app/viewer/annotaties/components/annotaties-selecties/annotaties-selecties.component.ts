import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GebiedsaanwijzingenVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';
import { LocatieVM } from '~viewer/annotaties/types/locatieVM';
import { ActiviteitLocatieaanduidingenGroepVM } from '~viewer/gebieds-info/types/gebieds-info.model';
import { OmgevingsnormenVM } from '~viewer/normen/types/omgevingsnormenVM';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { ApiSource } from '~model/internal/api-source';
import { Selection, SelectionObjectType } from '~store/common/selection/selection.model';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';
import { FilterIdentification } from '~viewer/filter/types/filter-options';
import { BestemmingsplanFeatureGroupVM } from '~viewer/annotaties/types/bestemmingsplan-features';
import { AnnotationId } from '~viewer/documenten/types/annotation';

@Component({
  selector: 'dsov-annotaties-selecties',
  template: '',
})
export class AnnotatiesSelectiesComponent implements OnInit, OnDestroy {
  @Input()
  public gebiedsaanwijzingen: GebiedsaanwijzingenVM[];
  @Input()
  public locaties: LocatieVM[];
  @Input()
  public activiteitLocatieaanduidingen: ActiviteitLocatieaanduidingenGroepVM[];
  @Input()
  public omgevingswaarden: OmgevingsnormenVM[];
  @Input()
  public omgevingsnormen: OmgevingsnormenVM[];
  @Input()
  public bestemmingsplanFeatures: BestemmingsplanFeatureGroupVM[];
  @Input()
  public selectionObjectType: SelectionObjectType;
  @Input()
  public documentId: string;
  @Input()
  public gebiedenInFilter: FilterIdentification[];
  @Input()
  public annotationId: AnnotationId;

  private selections: Selection[] = [];

  constructor(private selectieFacade: SelectionFacade) {}

  ngOnInit(): void {
    this.getLocatiesForSelection();
    this.getGebiedsaanwijzingenForSelection();
    this.getActiviteitLocatieaanduidingenForSelection();
    this.getOmgevingsNormenForSelection();
    this.getBestemmingsplanFeaturesForSelection();
    this.selectieFacade.addSelections(this.selections);
  }

  ngOnDestroy(): void {
    this.selectieFacade.removeSelectionsForAnnotation(this.annotationId);
  }

  private getLocatiesForSelection(): void {
    this.locaties?.forEach(item =>
      this.selections.push({
        id: item.identificatie,
        regeltekstIdentificatie: this.annotationId.identificatie,
        regeltekstTechnischId: this.annotationId.technischId,
        apiSource: ApiSource.OZON,
        objectType: SelectionObjectType.WERKINGSGEBIED,
        name: item.naam,
        symboolcode: item.symboolcode,
        isOntwerp: item.isOntwerp,
      })
    );
  }

  private getGebiedsaanwijzingenForSelection(): void {
    this.gebiedsaanwijzingen?.forEach(type =>
      type.gebiedsaanwijzingen.map(item =>
        this.selections.push({
          id: item.identificatie,
          name: item.naam,
          regeltekstIdentificatie: this.annotationId.identificatie,
          regeltekstTechnischId: this.annotationId.technischId,
          apiSource: ApiSource.OZON,
          objectType: SelectionObjectType.GEBIEDSAANWIJZING,
          symboolcode: item.symboolcode,
          isOntwerp: item.isOntwerp,
        })
      )
    );
  }

  private getActiviteitLocatieaanduidingenForSelection(): void {
    this.activiteitLocatieaanduidingen?.forEach(type =>
      type.activiteitLocatieaanduidingen.map(item =>
        this.selections.push({
          id: item.identificatie,
          name: item.naam,
          regeltekstIdentificatie: this.annotationId.identificatie,
          regeltekstTechnischId: this.annotationId.technischId,
          apiSource: ApiSource.OZON,
          objectType: SelectionObjectType.REGELTEKST_ACTIVITEITLOCATIEAANDUIDING,
          symboolcode: item.symboolcode,
          isOntwerp: item.isOntwerp,
        })
      )
    );
  }

  private getOmgevingsNormenForSelection(): void {
    const normen = this.omgevingsnormen
      ?.map(item => item.normen)
      .concat(this.omgevingswaarden.map(item => item.normen))
      .flat();
    normen.forEach(norm => {
      norm.normwaarden.forEach(item =>
        this.selections.push({
          id: item.identificatie,
          parentId: norm.identificatie,
          parentName: norm.naam,
          regeltekstIdentificatie: this.annotationId.identificatie,
          regeltekstTechnischId: this.annotationId.technischId,
          apiSource: ApiSource.OZON,
          objectType:
            norm.normType === NormType.OMGEVINGSNORMEN
              ? SelectionObjectType.OMGEVINGSNORM_NORMWAARDE
              : SelectionObjectType.OMGEVINGSWAARDE_NORMWAARDE,
          isOntwerp: item.isOntwerp,
          name: item.naam,
        })
      );
    });
  }

  private getBestemmingsplanFeaturesForSelection(): void {
    this.bestemmingsplanFeatures?.forEach(group => {
      group.features.forEach(feature =>
        this.selections.push({
          id: feature.id,
          elementId: this.annotationId.elementId,
          documentDto: {
            documentId: this.documentId,
          },
          apiSource: ApiSource.IHR,
          name: feature.naam,
          symboolcode: feature.symboolcode,
          objectType: group.objectType,
          locatieIds: feature.locatieIds,
        })
      );
    });
  }
}
