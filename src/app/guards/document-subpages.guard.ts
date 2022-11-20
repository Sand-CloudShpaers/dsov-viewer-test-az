import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiUtils } from '~general/utils/api.utils';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { IhrDocumentService } from '~viewer/documenten/services/ihr-document.service';
import { DocumentSubPages } from '~viewer/documenten/types/document-pages';
import { getDocumentVM } from '~viewer/documenten/utils/document-utils';

@Injectable({
  providedIn: 'root',
})
export class DocumentSubpagesGuard implements CanActivate {
  constructor(private router: Router, private ihrDocumentService: IhrDocumentService) {}

  public documentId: string;
  public tree: UrlTree;

  /**
   * Deze guard bepaalt aan de hand het type van het document de child route
   *
   * queryParamsHandling werkt niet in een Guard, waardoor het noodzakelijk is de queryParams expliciet door te geven
   * (https://stackoverflow.com/questions/45035660/angular-routing-canactivate-authguard-transmit-query-params/45843291#45843291)
   */
  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const documentId = route.params['id'];

    if (ApiUtils.isIhrDocument(documentId)) {
      if (this.documentId === documentId) {
        return of(this.tree);
      }

      return this.ihrDocumentService.getIhrDocument$(documentId).pipe(
        map(response => getDocumentVM(response)),
        map(documentVM => {
          this.tree = this.router.createUrlTree(
            [
              ApplicationPage.VIEWER,
              ViewerPage.DOCUMENT,
              route.params['id'],
              documentVM.subPages[0]?.path.toLowerCase(),
            ],
            {
              queryParams: route.queryParams,
            }
          );
          return this.tree;
        })
      );
    } else {
      return of(
        this.router.createUrlTree(
          [
            ApplicationPage.VIEWER,
            ViewerPage.DOCUMENT,
            route.params['id'],
            DocumentSubPages['inhoud'].path.toLowerCase(),
          ],
          {
            queryParams: route.queryParams,
          }
        )
      );
    }
  }
}
