import { Component, Input, OnInit } from '@angular/core';
import {
  AanduidingLocatiesVM,
  ActiviteitLocatieaanduidingenGroepVM,
} from '~viewer/gebieds-info/types/gebieds-info.model';
import { ApiSource } from '~model/internal/api-source';
import { SelectableListVM } from '~viewer/components/selectable-list/types/selectable-list-item';
import { AnnotatiesFacade } from '~viewer/annotaties/+state/annotaties.facade';
import { Observable } from 'rxjs';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { AnnotationId } from '~viewer/documenten/types/annotation';

@Component({
  selector: 'dsov-activiteiten',
  templateUrl: './activiteiten.component.html',
})
export class ActiviteitenComponent implements OnInit {
  @Input() public activiteiten: ActiviteitLocatieaanduidingenGroepVM[];
  @Input() public annotationId: AnnotationId;
  @Input() public showCheckboxes: boolean;
  @Input() public showSliders: boolean;
  @Input() public preselected = false;

  public aanduidingenLocaties$: Observable<AanduidingLocatiesVM[]> = this.annotatiesFacade.getAanduidingLocatiesByIds$(
    []
  );

  constructor(private annotatiesFacade: AnnotatiesFacade) {}

  public ngOnInit(): void {
    this.activiteiten.forEach(activiteit => {
      activiteit.activiteitLocatieaanduidingen.forEach(activiteitLocatieAanduiding => {
        this.annotatiesFacade.activiteitLocatieaanduidingenExpanded(activiteitLocatieAanduiding);
      });
    });
    this.aanduidingenLocaties$ = this.annotatiesFacade.getAanduidingLocatiesByIds$(
      this.activiteiten
        .map(groepvm => groepvm.activiteitLocatieaanduidingen.map(aanduiding => aanduiding.identificatie))
        .flat()
    );
  }

  public getActiviteitLocatieaanduidingen(
    activiteiten: ActiviteitLocatieaanduidingenGroepVM[],
    aanduidingenLocaties: AanduidingLocatiesVM[]
  ): SelectableListVM {
    // Get a sorted array of ALA's of all activiteiten
    const activiteitLocatieaanduidingen = activiteiten
      .map(activiteit => activiteit.activiteitLocatieaanduidingen)
      .flat()
      .sort((a, b) => a.naam.localeCompare(b.naam));

    return {
      items: activiteitLocatieaanduidingen.map(item => ({
        id: item.identificatie,
        regeltekstIdentificatie: this.annotationId.identificatie,
        regeltekstTechnischId: this.annotationId.technischId,
        name: item.naam,
        kwalificatie:
          item.regelkwalificatie === 'anders geduid'
            ? this.getLocatieNamen(item.identificatie, aanduidingenLocaties)
            : `${item.regelkwalificatie} ${this.getLocatieNamen(item.identificatie, aanduidingenLocaties)}`,
        apiSource: ApiSource.OZON,
        objectType: SelectionObjectType.REGELTEKST_ACTIVITEITLOCATIEAANDUIDING,
        symboolcode: item.symboolcode,
        isSelected: this.preselected || !!item.isSelected,
        isOntwerp: item.isOntwerp,
      })),
    };
  }

  private getLocatieNamen(activiteitLocatieaanduidingId: string, aanduidingenLocaties: AanduidingLocatiesVM[]): string {
    const aanduidingLocs = aanduidingenLocaties?.find(
      aanduidingLocaties => aanduidingLocaties?.id === activiteitLocatieaanduidingId
    );
    if (aanduidingLocs) {
      return `in: ${aanduidingLocs.locaties.map(loc => loc.naam)}`;
    }
    return '';
  }
}
