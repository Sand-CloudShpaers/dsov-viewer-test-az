import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '~store/state';
import { Thema } from '~model/gegevenscatalogus/thema';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { ContentService } from '~services/content.service';
import { ContentComponentBase } from '~general/components/content-component-base/content-component-base';

@Component({
  selector: 'dsov-overzicht-thema',
  templateUrl: './overzicht-thema.component.html',
  styleUrls: ['./overzicht-thema.component.scss'],
})
export class OverzichtThemaComponent extends ContentComponentBase {
  @Input() public themas: Thema[] = [];
  @Input() public showAll = false;
  @Output() public openPage = new EventEmitter<ViewerPage>();

  public viewerPage = ViewerPage;

  constructor(
    protected contentService: ContentService,
    private store: Store<State>,
    private filterFacade: FilterFacade
  ) {
    super(contentService);
  }

  public getThemas(): Thema[] {
    return this.showAll ? this.themas : this.themas?.filter(thema => thema.default);
  }

  public onSelectThema(thema: Thema): void {
    this.filterFacade.openThemaFilter(thema);
  }

  public trackByFn(_index: number, item: Thema): string {
    return item.name;
  }
}
