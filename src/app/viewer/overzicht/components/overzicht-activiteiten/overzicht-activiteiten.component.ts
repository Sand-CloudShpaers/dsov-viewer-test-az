import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { ActiviteitenFacade } from '~viewer/overzicht/activiteiten/+state/activiteiten.facade';
import { ContentService } from '~services/content.service';
import { ContentComponentBase } from '~general/components/content-component-base/content-component-base';

@Component({
  selector: 'dsov-overzicht-activiteiten',
  templateUrl: './overzicht-activiteiten.component.html',
  styleUrls: ['./overzicht-activiteiten.component.scss'],
})
export class OverzichtActiviteitenComponent extends ContentComponentBase implements OnInit {
  public activiteitenStatus$ = this.activiteitenFacade.getActiviteitenStatus$;
  public activiteitenGroepen$ = this.activiteitenFacade.getActiviteitenGroepen$;
  public viewerPage = ViewerPage;

  @Output() public openPage = new EventEmitter<ViewerPage>();

  constructor(protected contentService: ContentService, private activiteitenFacade: ActiviteitenFacade) {
    super(contentService);
  }

  public ngOnInit(): void {
    this.activiteitenFacade.loadActiviteiten();
  }
}
