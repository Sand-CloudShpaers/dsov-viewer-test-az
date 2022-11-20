import { Component, Input } from '@angular/core';
import { ApiSource } from '~model/internal/api-source';
import { BestemmingsplanFeatureGroupVM } from '~viewer/annotaties/types/bestemmingsplan-features';
import { SelectableListVM } from '~viewer/components/selectable-list/types/selectable-list-item';
import { AnnotationId } from '~viewer/documenten/types/annotation';

@Component({
  selector: 'dsov-bestemmingsplan-features',
  templateUrl: './bestemmingsplan-features.component.html',
})
export class BestemmingsplanFeaturesComponent {
  @Input() public featureGroup: BestemmingsplanFeatureGroupVM;
  @Input() public documentId: string;
  @Input() public annotationId: AnnotationId;

  public getSelectableList(): SelectableListVM[] {
    return [
      {
        items: this.featureGroup.features.map(feature => ({
          id: feature.id,
          elementId: this.annotationId.elementId,
          name: feature.naam,
          documentDto: {
            documentId: this.documentId,
          },
          objectType: this.featureGroup.objectType,
          apiSource: ApiSource.IHR,
          isSelected: feature.isSelected,
          symboolcode: feature.symboolcode,
          locatieIds: feature.locatieIds,
        })),
      },
    ];
  }

  public isExpanded(): boolean {
    return this.featureGroup.features.some(feature => feature.isSelected);
  }
}
