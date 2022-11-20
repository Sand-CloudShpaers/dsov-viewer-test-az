import { Component, Input } from '@angular/core';
import { ApiSource } from '~model/internal/api-source';
import { SelectableListVM } from '~viewer/components/selectable-list/types/selectable-list-item';
import { LocatieVM } from '~viewer/annotaties/types/locatieVM';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { AnnotationId } from '~viewer/documenten/types/annotation';

@Component({
  selector: 'dsov-locaties',
  templateUrl: './locaties.component.html',
})
export class LocatiesComponent {
  @Input()
  public locaties: LocatieVM[];
  @Input()
  public annotationId: AnnotationId;

  public getLocaties(locaties: LocatieVM[]): SelectableListVM {
    return {
      items: locaties.map(locatie => ({
        id: locatie.identificatie,
        regeltekstIdentificatie: this.annotationId.identificatie,
        regeltekstTechnischId: this.annotationId.technischId,
        name: locatie.naam,
        objectType: SelectionObjectType.WERKINGSGEBIED,
        apiSource: ApiSource.OZON,
        symboolcode: locatie.symboolcode,
        isSelected: locatie.isSelected,
        isOntwerp: locatie.isOntwerp,
      })),
    };
  }

  public trackByFn(_index: number, item: LocatieVM): string {
    return item.identificatie;
  }
}
