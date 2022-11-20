import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { GebiedsaanwijzingVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { ApiSource } from '~model/internal/api-source';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { SelectionObjectType } from '~store/common/selection/selection.model';

@Component({
  selector: 'dsov-overzicht-gebieden',
  templateUrl: './overzicht-gebieden.component.html',
})
export class OverzichtGebiedenComponent implements OnInit {
  public viewerPage = ViewerPage;

  @Input() public overzichtGebieden: GebiedsaanwijzingVM[];
  @Input() public gebiedsaanwijzingenStatus: DerivedLoadingState;

  @Output() public openPage = new EventEmitter<ViewerPage>();

  public selectedGebied: GebiedsaanwijzingVM;

  constructor(private selectionFacade: SelectionFacade, private filterFacade: FilterFacade) {}

  public ngOnInit(): void {
    this.selectionFacade.addSelections(
      this.overzichtGebieden.map(gebied => ({
        id: gebied.identificatie,
        apiSource: ApiSource.OZON,
        objectType: SelectionObjectType.GEBIEDSAANWIJZING,
        name: gebied.naam,
      }))
    );
  }

  public openGebiedenFilter(gebied: GebiedsaanwijzingVM): void {
    this.selectedGebied = gebied;
    this.filterFacade.openGebiedenFilter([
      {
        id: gebied.identificatie,
        name: gebied.naam,
        objectType: SelectionObjectType.GEBIEDSAANWIJZING,
      },
    ]);
  }

  public trackByFn(_index: number, item: GebiedsaanwijzingVM): string {
    return item.identificatie;
  }
}
