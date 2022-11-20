import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DocumentSubPage } from '~viewer/documenten/types/document-pages';
import { normalizeString } from '~general/utils/string.utils';
import { Router } from '@angular/router';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { DocumentVM } from '~viewer/documenten/types/documenten.model';
import { filter, Subject, takeUntil } from 'rxjs';
import { ApiSource } from '~model/internal/api-source';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { KaartlaagUtils } from '~viewer/kaart/utils/kaartlaag-utils';

@Component({
  selector: 'dsov-document-page-nav',
  templateUrl: './document-page-nav.component.html',
})
export class DocumentPageNavComponent implements OnInit, OnDestroy {
  @Input() public documentVM: DocumentVM;

  public subPages: DocumentSubPage[];
  private onDestroy$ = new Subject<void>();

  constructor(private router: Router, private kaartService: KaartService) {}

  public ngOnInit(): void {
    if (this.documentVM) {
      this.subPages = this.documentVM.subPages;

      if (this.documentVM.apiSource === ApiSource.IHR) {
        this.kaartService.featuresAtLocation
          .pipe(
            filter(data => !!data),
            takeUntil(this.onDestroy$)
          )
          .subscribe(() => {
            if (
              KaartlaagUtils.isBestemmingsPlanAchtigeByType(
                this.documentVM.type,
                this.documentVM.bevoegdGezag.bestuurslaag
              )
            ) {
              this.router.navigate(
                [`${ApplicationPage.VIEWER}/${ViewerPage.DOCUMENT}/${this.documentVM.documentId}/locatiedetails`],
                {
                  queryParamsHandling: 'preserve',
                }
              );
            }
          });
      }
    }
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public getRouterLink(page: string): string[] {
    return [normalizeString(page)];
  }

  public trackByPage(_index: number, item: DocumentSubPage): DocumentSubPage {
    return item;
  }
}
