import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ApiSource } from '~model/internal/api-source';
import { Selection } from '~store/common/selection/selection.model';
import { SelectableListItemVM } from '~viewer/components/selectable-list/types/selectable-list-item';
import { IMROCartografieInfoDetailVM, IMROCartografieInfoVM } from '~viewer/documenten/types/map-details';
import { MapDetailsFacade } from '~viewer/documenten/+state/map-details.facade';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';

@Component({
  selector: 'dsov-kaarten-list',
  templateUrl: './kaarten-list-imro.component.html',
})
export class KaartenListImroComponent implements OnChanges, OnDestroy {
  @Input() planId: string;
  @Input() mapDetails: IMROCartografieInfoVM[];

  public openGroupKey: number;
  public subGroups: string[];

  constructor(private mapDetailsFacade: MapDetailsFacade, private selectionFacade: SelectionFacade) {}

  public ngOnDestroy(): void {
    this.removeSelections();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.mapDetails = changes.mapDetails?.currentValue;
    if (this.mapDetails && this.mapDetails.length > 0) {
      // Always show group for bestemmingsplannen
      if (this.isPlanKaart(this.mapDetails[0])) {
        this.toggleFirstGroup();
      }
      // Close all groups when features change
      else {
        this.toggleGroup(null);
      }
    }
  }

  public toggleFirstGroup(): void {
    this.openGroupKey = null;
    if (this.mapDetails?.length > 0) {
      this.toggleGroup(this.mapDetails[0].nummer);
    }
  }

  public toggleGroup(toggledGroup: number): void {
    this.removeSelections();

    this.openGroupKey = toggledGroup === this.openGroupKey ? null : toggledGroup;
    this.mapDetails.forEach(group => {
      group.details.forEach(item => {
        item.selected = group.nummer === this.openGroupKey;
      });
    });
    this.showOnMap();
  }

  public toggleLayer(event: { item: IMROCartografieInfoDetailVM; checked: boolean; groupKey: number }): void {
    const kaart = this.mapDetails.find(k => k.nummer === event.groupKey);
    if (kaart) {
      const object = kaart.details.find(x => x.id === event.item.id);
      if (object) {
        object.selected = event.checked;
        if (!object.selected) {
          this.selectionFacade.removeSelections([{ id: object.id, name: object.naam, apiSource: ApiSource.IHR }]);
        }
      }
      this.showOnMap();
    }
  }

  public showOnMap(): void {
    const selections = this.getSelections();
    this.selectionFacade.updateSelections(selections);
    this.mapDetailsFacade.showMapDetails(selections, this.planId);
  }

  public removeSelections(): void {
    const selections = this.getSelections();
    if (selections.length) {
      this.selectionFacade.removeSelections(selections);
    }
  }

  public getSelections(): Selection[] {
    let selections: Selection[] = [];
    const details = this.mapDetails.map(x => x.details).flat();
    selections = details
      ?.filter(item => item.selected)
      .map(item => ({
        id: item.id,
        name: item.naam,
        documentDto: {
          documentId: this.planId,
          apiSource: ApiSource.IHR,
        },
        objectType: null,
        symboolcode: item.symboolcode,
        apiSource: ApiSource.IHR,
        locatieIds: [item.id],
      }));

    return selections;
  }

  public isPlanKaart(group: IMROCartografieInfoVM): boolean {
    return group.naam === 'Plankaart';
  }

  public getUniqueTypes(group: IMROCartografieInfoVM): string[] {
    return [...new Set(group.details.map(item => item.type).flat())].sort((a, b) => a.localeCompare(b));
  }

  public getItemsByType(group: IMROCartografieInfoVM, type: string): IMROCartografieInfoDetailVM[] {
    return group.details.filter(item => item.type === type);
  }

  public trackByListItem(_index: number, item: SelectableListItemVM): string {
    return item.id;
  }

  public trackByCartografie(_index: number, item: IMROCartografieInfoVM): string {
    return item.naam;
  }

  public trackByObjectInfo(_index: number, item: IMROCartografieInfoDetailVM): string {
    return item.naam;
  }

  public trackByType(_index: number, item: string): string {
    return item;
  }

  public trackByGroup(index: number): number {
    return index;
  }
}
