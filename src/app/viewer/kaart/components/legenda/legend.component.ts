import { Component } from '@angular/core';
import { LocationType } from '~model/internal/active-location-type.model';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { LocatieFilter } from '~viewer/filter/types/filter-options';
import { LegendGroupVM } from './types/legend-group';

@Component({
  selector: 'dsov-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
})
export class LegendComponent {
  public legend$ = this.selectionFacade.legend$;
  public locatieFilter$ = this.filterFacade.locatieFilter$;

  public expand: boolean;

  constructor(private filterFacade: FilterFacade, private selectionFacade: SelectionFacade) {}

  public getLegendGroups(groups: LegendGroupVM[]): LegendGroupVM[] {
    /* Toon alleen de eerste 6 items, wanneer ingeklapt */
    return groups.filter((_item, index) => this.expand || index < 6);
  }

  public getLocatieSymboolcode(locatie: LocatieFilter): string {
    if ([LocationType.CoordinatenETRS89, LocationType.CoordinatenRD].includes(locatie.source)) {
      return 'zoek-punt';
    }
    return 'zoek-gebied';
  }

  public toggle(): void {
    this.expand = !this.expand;
  }

  public trackByFn(index: number): number {
    return index;
  }
}
