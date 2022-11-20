import { Component, Input } from '@angular/core';
import { ApiSource } from '~model/internal/api-source';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { SelectableListVM } from '~viewer/components/selectable-list/types/selectable-list-item';
import { GebiedsaanwijzingenVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';
import { FilterIdentification } from '~viewer/filter/types/filter-options';
import { AnnotationId } from '~viewer/documenten/types/annotation';

@Component({
  selector: 'dsov-gebiedsaanwijzingen',
  templateUrl: './gebiedsaanwijzingen.component.html',
})
export class GebiedsaanwijzingenComponent {
  @Input() public gebiedsaanwijzingen: GebiedsaanwijzingenVM[] = [];
  @Input() public showCheckboxes: boolean;
  @Input() public showSliders: boolean;
  @Input() public gebiedenInFilter: FilterIdentification[];
  @Input() public annotationId: AnnotationId;

  public getSelectableList(item: GebiedsaanwijzingenVM): SelectableListVM {
    return {
      items: item.gebiedsaanwijzingen.map(gebiedsaanwijzing => ({
        id: gebiedsaanwijzing.identificatie,
        name: `<strong>${gebiedsaanwijzing.naam}</strong> (${gebiedsaanwijzing.groep})`,
        regeltekstIdentificatie: this.annotationId?.identificatie,
        regeltekstTechnischId: this.annotationId?.technischId,
        objectType: SelectionObjectType.GEBIEDSAANWIJZING,
        apiSource: ApiSource.OZON,
        symboolcode: gebiedsaanwijzing.symboolcode,
        isSelected: gebiedsaanwijzing.isSelected,
        isOntwerp: gebiedsaanwijzing.isOntwerp,
        isInFilter: this.isInFilter(gebiedsaanwijzing.identificatie),
      })),
    };
  }

  private isInFilter(id: string): boolean {
    return this.gebiedenInFilter?.filter(g => g.id === id).length > 0;
  }

  public trackByGebiedsaanwijzingenVM(_index: number, item: GebiedsaanwijzingenVM): string {
    return item.gebiedsaanwijzingType;
  }
}
