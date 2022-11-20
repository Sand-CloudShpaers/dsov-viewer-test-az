import { Component, OnInit } from '@angular/core';
import { ApplicationPage, ApplicationTitle } from '~store/common/navigation/types/application-page';
import { Title } from '@angular/platform-browser';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';

@Component({
  selector: 'dsov-search-documents',
  templateUrl: './search-documents-page.component.html',
  styleUrls: ['./search-documents-page.component.scss'],
})
export class SearchDocumentsPageComponent implements OnInit {
  public APPLICATION_PAGE = ApplicationPage;
  public documenttypes$ = this.gegevenscatalogusProvider.getDocumenttypes$();

  constructor(
    private titleService: Title,
    private gegevenscatalogusProvider: GegevenscatalogusProvider,
    private selectionFacade: SelectionFacade
  ) {}

  public ngOnInit(): void {
    this.titleService.setTitle(ApplicationTitle);
    this.selectionFacade.resetSelections(false);
  }
}
