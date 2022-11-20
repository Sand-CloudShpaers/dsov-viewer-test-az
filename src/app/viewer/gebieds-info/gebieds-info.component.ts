import { Component, OnInit } from '@angular/core';
import { Selection, SelectionObjectType } from '~store/common/selection/selection.model';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';
import { GebiedsInfoFacade } from '~viewer/gebieds-info/+state/gebieds-info.facade';
import { SelectionSet, ViewSelectionItems } from '~viewer/gebieds-info/types/gebieds-info.model';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilterName, GebiedenFilter } from '~viewer/filter/types/filter-options';
import { RegelsbeleidType, RegelStatus, RegelStatusType } from '~model/regel-status.model';
import { ContentService } from '~services/content.service';
import { ContentComponentBase } from '~general/components/content-component-base/content-component-base';
import { NavigationService } from '~store/common/navigation/services/navigation.service';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';

@Component({
  selector: 'dsov-gebieds-info',
  templateUrl: './gebieds-info.component.html',
  styleUrls: ['./gebieds-info.component.scss'],
})
export class GebiedsInfoComponent extends ContentComponentBase implements OnInit {
  public activeSelection$ = this.selectionFacade.getSelections$;
  public viewSelectionStatus$ = this.gebiedsInfoFacade.getViewSelectionLoadingStatus$;
  public viewSelectionItems$ = this.gebiedsInfoFacade.getViewSelectionItems$;
  public isLargeArea$ = this.gebiedsInfoFacade.activeLocationIsLargeArea$;
  public gebiedsaanwijzingenStatus$ = this.gebiedsInfoFacade.getGebiedsaanwijzingenStatus$;
  public gebiedsaanwijzingen$ = this.gebiedsInfoFacade.getGebiedsaanwijzingen$;
  public omgevingsnormenStatus$ = this.gebiedsInfoFacade.getOmgevingsnormenStatus$;
  public omgevingsnormen$ = this.gebiedsInfoFacade.getOmgevingsnormen$;
  public omgevingswaardenStatus$ = this.gebiedsInfoFacade.getOmgevingswaardenStatus$;
  public omgevingswaarden$ = this.gebiedsInfoFacade.getOmgevingswaarden$;
  public omgevingsplanPons$ = this.gebiedsInfoFacade.omgevingsplanPons$;
  public isDirty$ = this.filteredResultsFacade.getIsDirty$;

  public NormTypeEnum = NormType;
  public selectedItems = 0;
  public selectedOmgevingsnormen: SelectionSet[] = [];
  public selectedOmgevingswaarden: SelectionSet[] = [];
  public selectedGebiedsaanwijzingen: SelectionSet[] = [];
  public selectedItemsText: string;

  constructor(
    protected contentService: ContentService,
    private gebiedsInfoFacade: GebiedsInfoFacade,
    private selectionFacade: SelectionFacade,
    private filterFacade: FilterFacade,
    private navigationService: NavigationService,
    private filteredResultsFacade: FilteredResultsFacade
  ) {
    super(contentService);
  }

  public ngOnInit(): void {
    this.gebiedsInfoFacade.loadOmgevingsnormen();
    this.gebiedsInfoFacade.loadOmgevingswaarden();
    this.gebiedsInfoFacade.loadGebiedsaanwijzingen();
    this.selectionFacade.showSelectionsOnMap();

    this.filterFacade.resetFilters([
      FilterName.ACTIVITEIT,
      FilterName.DOCUMENTEN,
      FilterName.THEMA,
      FilterName.GEBIEDEN,
    ]);
  }

  public selectedFilterItemsCount(activeSliders: Selection[], viewSelectionItems: ViewSelectionItems): number {
    this.selectedOmgevingsnormen = viewSelectionItems.omgevingsnormen.filter(x =>
      activeSliders.some(slider => slider.parentId === x.identificatie)
    );
    this.selectedOmgevingswaarden = viewSelectionItems.omgevingswaarden.filter(x =>
      activeSliders.some(slider => slider.parentId === x.identificatie)
    );
    this.selectedGebiedsaanwijzingen = viewSelectionItems.gebiedsaanwijzingen.filter(x =>
      activeSliders.some(slider => slider.id === x.identificatie)
    );

    // activiteitLocatieaanduidingen altijd meetellen of de slider nu wel of niet actief is
    this.selectedItems =
      this.selectedOmgevingsnormen.length +
      this.selectedOmgevingswaarden.length +
      this.selectedGebiedsaanwijzingen.length;
    this.selectedItemsText = this.selectedItems + ' item' + (this.selectedItems > 1 ? 's' : '') + ' geselecteerd';

    return this.selectedItems;
  }

  public viewSelection(): void {
    const gebieden: GebiedenFilter[] = this.selectedOmgevingsnormen
      .map(x => ({
        id: x.identificatie,
        name: x.naam,
        objectType: SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
      }))
      .concat(
        this.selectedOmgevingswaarden.map(x => ({
          id: x.identificatie,
          name: x.naam,
          objectType: SelectionObjectType.OMGEVINGSWAARDE_NORMWAARDE,
        }))
      )
      .concat(
        this.selectedGebiedsaanwijzingen.map(x => ({
          id: x.identificatie,
          name: x.naam,
          objectType: SelectionObjectType.GEBIEDSAANWIJZING,
        }))
      );

    this.filterFacade.openGebiedenFilter(gebieden);
  }

  public openDocumenten(): void {
    this.filterFacade.updateFilters({ regelsbeleid: [RegelsbeleidType.regels, RegelStatusType[RegelStatus.Geldend]] }, [
      ApplicationPage.VIEWER,
      ViewerPage.DOCUMENTEN,
    ]);
  }

  public openPage(page: ViewerPage): void {
    this.navigationService.routeLocationNavigationPath(page);
  }
}
