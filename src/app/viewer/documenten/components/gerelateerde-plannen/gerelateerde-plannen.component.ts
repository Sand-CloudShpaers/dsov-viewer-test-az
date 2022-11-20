import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { DocumentVM } from '~viewer/documenten/types/documenten.model';
import { DocumentVMUtils } from '~viewer/documenten/utils/documentVM-utils';

@Component({
  selector: 'dsov-gerelateerde-plannen',
  templateUrl: './gerelateerde-plannen.component.html',
})
export class GerelateerdePlannenComponent extends DocumentVMUtils {
  @Input() public documenten: DocumentVM[];

  public show = true;

  constructor(private navigationFacade: NavigationFacade, private router: Router) {
    super();
  }

  openDocument(planId: string): void {
    this.navigationFacade.setNavigationPath(ViewerPage.DOCUMENT, location.pathname);
    this.router.navigate([`${ApplicationPage.VIEWER}/${ViewerPage.DOCUMENT}/${planId}`], {
      queryParamsHandling: 'preserve',
    });
  }

  public trackByGerelateerdPlan(_index: number, gerelateerdPlan: DocumentVM): string {
    return gerelateerdPlan.documentId;
  }
}
