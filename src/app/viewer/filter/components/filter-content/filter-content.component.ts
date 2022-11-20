import { Component, EventEmitter, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Documenttype } from '~model/gegevenscatalogus/documenttype';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { FilterFacade } from '~viewer/filter/filter.facade';
import {
  FilterIdentification,
  FilterName,
  FilterOptions,
  LocatieFilter,
  RegelgevingtypeFilter,
} from '~viewer/filter/types/filter-options';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { SearchFacade } from '~viewer/search/+state/search.facade';
import { initialFilterOptions } from '~viewer/filter/+state/filter.reducer';
import { FilterConfirmationOptions } from '../filter-confirmation/filter-confirmation.component';
import { SearchMode } from '~viewer/search/types/search-mode';
import { ContentComponentBase } from '~general/components/content-component-base/content-component-base';
import { ContentService } from '~services/content.service';

@Component({
  selector: 'dsov-filter-content',
  templateUrl: './filter-content.component.html',
  styleUrls: ['./filter-content.component.scss'],
})
export class FilterContentComponent extends ContentComponentBase {
  @Output() public closePanel = new EventEmitter();
  @Output() public confirmPanel = new EventEmitter<FilterConfirmationOptions>();

  public SearchMode = SearchMode;
  public FilterName = FilterName;
  public ViewerPage = ViewerPage;
  public documenttypes$: Observable<Documenttype[]>;
  public regelgevingtypes$: Observable<RegelgevingtypeFilter[]>;
  public filterOptions$: Observable<FilterOptions>;
  public locatieFilter$ = this.filterFacade.locatieFilter$;
  public locationSearchMode$ = this.searchFacade.searchMode$;

  public selectedFilters: FilterOptions = {};
  public selectedLocation: LocatieFilter;
  public saved: boolean;
  public showConfirmation: boolean;

  public documenttype: boolean;
  public regelgevingtype: boolean;

  public viewerPage = ViewerPage;

  private filterLabel = {
    [FilterName.LOCATIE]: 'locatie',
    [FilterName.ACTIVITEIT]: 'activiteiten',
    [FilterName.GEBIEDEN]: 'gebieden',
    [FilterName.DOCUMENTEN]: 'documenten',
    [FilterName.THEMA]: "thema's",
    [FilterName.DOCUMENT_TYPE]: 'documenttype',
    [FilterName.REGELGEVING_TYPE]: 'regelgevingtype',
    [FilterName.REGELSBELEID]: 'regels en beleid',
    [FilterName.DATUM]: 'datum',
  };

  constructor(
    protected contentService: ContentService,
    private gegevenscatalogusProvider: GegevenscatalogusProvider,
    private filterFacade: FilterFacade,
    private searchFacade: SearchFacade
  ) {
    super(contentService);
    this.documenttypes$ = this.gegevenscatalogusProvider.getDocumenttypes$();
    this.regelgevingtypes$ = this.gegevenscatalogusProvider.getRegelgevingTypes$();
    this.filterOptions$ = this.filterFacade.filterOptions$;
  }

  public getFilterOptionsForName(filterOptions: FilterOptions, name: FilterName): FilterOptions {
    if (name) {
      return {
        ...initialFilterOptions,
        [name]: filterOptions[name],
      };
    }
    return initialFilterOptions;
  }

  public onFilterSelected(filterOptions: FilterOptions): void {
    this.saved = true;
    this.selectedFilters = { ...this.selectedFilters, ...filterOptions };
  }

  public changeLocatieFilter(locatieFilter: LocatieFilter, filters: FilterOptions): void {
    this.selectedLocation = locatieFilter;
    this.confirm({ filters: filters, name: FilterName.LOCATIE });
  }

  public confirm(options: { filters: FilterOptions; name: FilterName; page?: ViewerPage }): void {
    const confirmationOptions: FilterConfirmationOptions = {
      name: options.name,
      page: options.page,
      title: null,
      message: null,
      toBeDeletedFilter: null,
    };

    let toBeDeletedFilter: FilterName;

    if (options.filters.gebieden?.length) {
      toBeDeletedFilter = FilterName.GEBIEDEN;
    } else if (options.filters.activiteit?.length) {
      toBeDeletedFilter = FilterName.ACTIVITEIT;
    } else if (options.filters.thema?.length) {
      toBeDeletedFilter = FilterName.THEMA;
    }

    if (toBeDeletedFilter && toBeDeletedFilter !== options.name) {
      confirmationOptions.toBeDeletedFilter = toBeDeletedFilter;
      confirmationOptions.title = `Uw gekozen ${this.filterLabel[toBeDeletedFilter]} worden verwijderd`;
      confirmationOptions.message = this.getMessage(options.name, this.filterLabel[toBeDeletedFilter]);

      this.confirmPanel.emit(confirmationOptions);
    } else {
      this.confirmed(confirmationOptions);
    }
  }

  public confirmed(options: FilterConfirmationOptions): void {
    this.saved = true;
    this.selectedFilters[options.toBeDeletedFilter] = [];
    if (options.page) {
      this.filterAcknowledged(options.page);
    }
  }

  public canceled(name: FilterName): void {
    if (name === FilterName.LOCATIE) {
      this.locatieFilter$ = of(undefined);
      this.selectedLocation = null;
      setTimeout(() => (this.locatieFilter$ = this.filterFacade.locatieFilter$), 100);
    }
  }

  public filterAcknowledged(page?: ViewerPage): void {
    if (this.selectedLocation) {
      this.selectedFilters[FilterName.LOCATIE] = [this.selectedLocation];
    }
    this.filterFacade.updateFilters(this.selectedFilters, page ? [ApplicationPage.VIEWER, page] : []);
    this.close();
  }

  public close(): void {
    this.closePanel.emit();
  }

  // Activeer delen van het filterpaneel alleen als er niet getijdreisd wordt
  public isTimeTravel(filterOption: FilterIdentification[]): boolean {
    return !!filterOption.length && filterOption[0].timeTravelDate !== undefined;
  }

  // Voorkom dat de click op de toggletip omhoog bubblet naar de button van de dso-accordion-section,
  // zodat deze niet opent door een click op de toggletip
  public handleClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  private getMessage(filterName: FilterName | 'locatie', toBeDeletedFilterLabel: string): string {
    if (filterName === 'locatie') {
      return `Als u uw locatie wijzigt worden uw gekozen ${toBeDeletedFilterLabel} verwijderd.`;
    }
    if (filterName === FilterName.DOCUMENTEN) {
      return `Als u Alle documenten op uw locatie gaat bekijken worden uw gekozen ${toBeDeletedFilterLabel} verwijderd.`;
    }
    return `U kunt niet tegelijkertijd zoeken op ${toBeDeletedFilterLabel} en op ${this.filterLabel[filterName]}. Als u ${this.filterLabel[filterName]} gaat bekijken worden uw gekozen ${toBeDeletedFilterLabel} verwijderd.`;
  }
}
