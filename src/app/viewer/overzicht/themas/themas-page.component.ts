import { Component, OnInit } from '@angular/core';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { NavigationService } from '~store/common/navigation/services/navigation.service';
import { Thema } from '~model/gegevenscatalogus/thema';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { Store } from '@ngrx/store';
import { State } from '~store/state';
import { FilterName } from '~viewer/filter/types/filter-options';

@Component({
  selector: 'dsov-themas-page',
  templateUrl: './themas-page.component.html',
  styleUrls: ['./themas-page.component.scss'],
})
export class ThemasPageComponent implements OnInit {
  public themas$ = this.gegevenscatalogusProvider.getThemas$();

  constructor(
    private gegevenscatalogusProvider: GegevenscatalogusProvider,
    private navigationService: NavigationService,
    private filterFacade: FilterFacade,
    private store: Store<State>
  ) {}

  public ngOnInit(): void {
    this.filterFacade.resetFilters([
      FilterName.ACTIVITEIT,
      FilterName.DOCUMENTEN,
      FilterName.THEMA,
      FilterName.GEBIEDEN,
    ]);
  }

  public previousPage(): void {
    this.navigationService.routeLocationNavigationPath(ViewerPage.OVERZICHT);
  }

  public onSelectThema(thema: Thema): void {
    this.filterFacade.openThemaFilter(thema);
  }

  public trackByFn(_index: number, item: Thema): string {
    return item.name;
  }
}
