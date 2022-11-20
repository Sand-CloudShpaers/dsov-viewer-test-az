import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { NavigationPaths } from '~store/common/navigation/types/navigation-paths';
import { ConfigService } from '~services/config.service';
import { ApiUtils } from '~general/utils/api.utils';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { TimeTravelQueryParams } from '~store/common/navigation/types/query-params';
import { DocumentVM } from '~viewer/documenten/types/documenten.model';

@Component({
  selector: 'dsov-documenten-page',
  templateUrl: './documenten-page.component.html',
  styleUrls: ['./documenten-page.component.scss'],
})
export class DocumentenPageComponent implements OnInit, OnDestroy {
  public previousPaths$ = this.navigationFacade.previousPaths$;
  public documentenStatus$ = this.documentenFacade.documentenStatus$;
  public documentDto$ = this.documentenFacade.currentDocumentDto$;
  public documentVM$: Observable<DocumentVM>;
  private onDestroy$ = new Subject<void>();
  public errorStatus: number;
  public VIEWER_LINK = '/' + ApplicationPage.VIEWER;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentenFacade: DocumentenFacade,
    private navigationFacade: NavigationFacade,
    private filterFacade: FilterFacade,
    private configService: ConfigService
  ) {}

  public ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.loadDocument();
    });

    this.route.queryParams.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.loadDocument();
    });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.documentenFacade.collapseAllElements();
    this.documentenFacade.resetSelectedDocument();
  }

  public back(previousPaths: NavigationPaths): void {
    if (previousPaths[ViewerPage.DOCUMENT]) {
      window.history.back();
      return;
    }
    if (previousPaths[ViewerPage.REGELSOPMAAT]) {
      this.router.navigate([previousPaths[ViewerPage.REGELSOPMAAT]], {
        queryParamsHandling: 'merge',
        queryParams: { isOntwerp: null },
      });
      return;
    }
    this.router.navigate([ApplicationPage.VIEWER]);
  }

  public isIhrDisabled(documentId: string): boolean {
    return !!this.configService.config.ihr.disabled && ApiUtils.isIhrDocument(documentId);
  }

  private loadDocument(): void {
    this.documentenFacade.loadDocument(
      {
        documentId: this.route.snapshot.params.id,
      },
      true,
      {
        inWerkingOp: this.route.snapshot.queryParams[TimeTravelQueryParams.IN_WERKING_OP],
        geldigOp: this.route.snapshot.queryParams[TimeTravelQueryParams.GELDIG_OP],
        beschikbaarOp: this.route.snapshot.queryParams[TimeTravelQueryParams.BESCHIKBAAR_OP],
      }
    );
    this.documentVM$ = of(undefined);
    // Hier moet wel een timeout om het navigatie panel ( = tabs) opnieuw te renderen
    setTimeout(() => (this.documentVM$ = this.documentenFacade.documentVM$(this.route.snapshot.params.id)), 100);
    this.filterFacade.setFiltersFromQueryParams(this.route.snapshot.queryParams);
  }
}
