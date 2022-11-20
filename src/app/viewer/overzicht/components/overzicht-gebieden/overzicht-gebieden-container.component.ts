import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GebiedsInfoFacade } from '~viewer/gebieds-info/+state/gebieds-info.facade';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { ContentComponentBase } from '~general/components/content-component-base/content-component-base';
import { ContentService } from '~services/content.service';

@Component({
  selector: 'dsov-overzicht-gebieden-container',
  templateUrl: './overzicht-gebieden-container.component.html',
  styleUrls: ['./overzicht-gebieden-container.component.scss'],
})
export class OverzichtGebiedenContainerComponent extends ContentComponentBase implements OnInit {
  public overzichtGebieden$ = this.gebiedsInfoFacade.getOverzichtGebieden$;
  public gebiedsaanwijzingenStatus$ = this.gebiedsInfoFacade.getGebiedsaanwijzingenStatus$;
  public viewerPage = ViewerPage;

  @Output() public openPage = new EventEmitter<ViewerPage>();

  constructor(private gebiedsInfoFacade: GebiedsInfoFacade, protected contentService: ContentService) {
    super(contentService);
  }

  ngOnInit(): void {
    this.gebiedsInfoFacade.loadGebiedsaanwijzingen();
  }
}
