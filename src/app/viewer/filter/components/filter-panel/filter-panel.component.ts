import { Component, ViewChild } from '@angular/core';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilterName } from '~viewer/filter/types/filter-options';
import {
  FilterConfirmationComponent,
  FilterConfirmationOptions,
} from '../filter-confirmation/filter-confirmation.component';
import { FilterContentComponent } from '../filter-content/filter-content.component';

@Component({
  selector: 'dsov-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
})
export class FilterPanelComponent {
  @ViewChild(FilterContentComponent) public filterContentComponent: FilterContentComponent;
  @ViewChild(FilterConfirmationComponent) public filterConfirmationComponent: FilterConfirmationComponent;
  public showPanel$ = this.filterFacade.getShowPanel$;

  constructor(private filterFacade: FilterFacade) {}

  public close(): void {
    this.filterFacade.hideFilterPanel();
  }

  public confirm(options: FilterConfirmationOptions): void {
    this.filterConfirmationComponent.confirm(options);
  }

  public confirmed(options: FilterConfirmationOptions): void {
    this.filterContentComponent.confirmed(options);
  }

  public canceled(name: FilterName): void {
    this.filterContentComponent.canceled(name);
  }
}
