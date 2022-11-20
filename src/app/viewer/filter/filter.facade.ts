import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { State } from '~store/state';
import * as FilterActions from '~viewer/filter/+state/filter.actions';
import { ActiviteitVM } from '~viewer/gebieds-info/types/gebieds-info.model';
import { Thema } from '~model/gegevenscatalogus/thema';
import { FilterName, FilterOptions, GebiedenFilter, LocatieFilter, NamedFilter } from './types/filter-options';
import {
  getLocatieFilter,
  getActiveZoekLocatieSystem,
  getFilterOptions,
  getFilterOptionsForLabels,
  getFilterOptionsForLocatie,
  getShowPanel,
} from './+state/filter.selectors';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import * as RegelsOpMaatActions from '~viewer/regels-op-maat/+state/regels-op-maat/regels-op-maat.actions';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { LocationSuggestion } from './types/location-suggestion';
import { SuggestDoc } from '~model/georegister/suggest.model';
import { LocatieFilterService } from '~viewer/filter/services/locatie-filter.service';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { Selection } from '~store/common/selection/selection.model';

@Injectable({ providedIn: 'root' })
export class FilterFacade {
  constructor(
    private store: Store<State>,
    private navigationFacade: NavigationFacade,
    private searchService: LocatieFilterService
  ) {}

  public readonly filterOptions$: Observable<FilterOptions> = this.store.select(getFilterOptions);
  public readonly filterOptionsForLabels$: Observable<FilterOptions> = this.store.select(getFilterOptionsForLabels);
  public readonly filterOptionsForLocatie$: Observable<FilterOptions> = this.store.select(getFilterOptionsForLocatie);
  public readonly locatieFilter$: Observable<LocatieFilter> = this.store.select(getLocatieFilter);
  public readonly activeZoekLocatieSystem$: Observable<ZoekLocatieSystem> =
    this.store.select(getActiveZoekLocatieSystem);
  public readonly getShowPanel$: Observable<boolean> = this.store.select(getShowPanel);

  public locationSuggestions$: Observable<LocationSuggestion[]> = this.searchService.searchSuggestions$.pipe(
    map((response: SuggestDoc[]) =>
      response.map((suggestion: SuggestDoc) => ({
        source: suggestion.type,
        name: suggestion.weergavenaam,
        pdokId: suggestion.id,
        type: suggestion.type,
        value: suggestion.weergavenaam,
      }))
    )
  );

  public showFilterPanel = (): void => this.store.dispatch(FilterActions.ShowFilterPanel());
  public hideFilterPanel = (): void => this.store.dispatch(FilterActions.HideFilterPanel());

  public setTimeTravelDate(timeTravelDate: string): void {
    this.store.dispatch(FilterActions.SetTimeTravelDate({ timeTravelDate }));
  }

  public updateFilters(filterOptions: FilterOptions, commands: string[]): void {
    this.store.dispatch(FilterActions.UpdateFilters({ filterOptions, commands }));
  }

  public resetFilters(filterNames: FilterName[]): void {
    this.store.dispatch(FilterActions.ResetFilters({ filterNames }));
  }

  public resetAllFilters(commands: string[]): void {
    this.store.dispatch(FilterActions.ResetAllFilters({ commands }));
  }

  public removeFilter(namedFilter: NamedFilter): void {
    this.store.dispatch(FilterActions.RemoveFilter({ namedFilter }));
  }

  public previewFilters(filterOptions: FilterOptions): void {
    this.store.dispatch(FilterActions.PreviewFilters({ filterOptions }));
  }

  public openThemaFilter(thema: Thema): void {
    this.navigationFacade.setNavigationPath(ViewerPage.DOCUMENTEN, location.pathname);
    this.store.dispatch(
      FilterActions.UpdateFilters({
        filterOptions: {
          [FilterName.THEMA]: [{ id: thema.id, name: thema.name }],
        },
        commands: [`${ApplicationPage.VIEWER}/${ViewerPage.DOCUMENTEN}`],
      })
    );
  }

  public openActiviteitFilter(activiteiten: ActiviteitVM[]): void {
    this.navigationFacade.setNavigationPath(ViewerPage.ACTIVITEITEN, location.pathname);
    this.store.dispatch(RegelsOpMaatActions.resetRegelsOpMaat());
    this.store.dispatch(
      FilterActions.UpdateFilters({
        filterOptions: {
          [FilterName.ACTIVITEIT]: activiteiten.map(x => ({
            id: x.identificatie,
            name: x.naam,
          })),
        },
        commands: [`${ApplicationPage.VIEWER}/${ViewerPage.REGELSOPMAAT}`],
      })
    );
  }

  public openGebiedenFilter(gebieden: GebiedenFilter[]): void {
    // zet navigatie pad om terug te kunnen navigeren vanuit regels op maat
    this.navigationFacade.setNavigationPath(ViewerPage.GEBIEDEN, location.pathname);
    this.store.dispatch(RegelsOpMaatActions.resetRegelsOpMaat());
    this.store.dispatch(
      FilterActions.UpdateFilters({
        filterOptions: {
          [FilterName.GEBIEDEN]: gebieden,
        },
        commands: [`${ApplicationPage.VIEWER}/${ViewerPage.REGELSOPMAAT}`],
      })
    );
  }

  public openDocumentenFilter(selections: Selection[]): void {
    this.navigationFacade.setNavigationPath(ViewerPage.DOCUMENTEN, location.pathname);
    this.store.dispatch(RegelsOpMaatActions.resetRegelsOpMaat());
    this.store.dispatch(
      FilterActions.UpdateFilters({
        filterOptions: {
          [FilterName.DOCUMENTEN]: selections.map(document => ({
            id: document.documentDto.documentId,
            name: document.documentDto.documentId,
            document: document.documentDto,
          })),
        },
        commands: [`${ApplicationPage.VIEWER}/${ViewerPage.REGELSOPMAAT}`],
      })
    );
  }

  public setFiltersFromQueryParams(queryParams: Params): void {
    this.store.dispatch(FilterActions.GetFiltersFromQueryParams({ queryParams }));
  }

  public resetLocationSuggestions(): void {
    this.searchService.suggestLocation();
  }

  public fetchLocationSuggestions(value: string): void {
    this.searchService.suggestLocation(value);
  }
}
