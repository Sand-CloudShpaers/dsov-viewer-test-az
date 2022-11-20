import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  public routeLocationNavigationPath(page: ViewerPage): void {
    this.router.navigate([`${ApplicationPage.VIEWER}/${page}`], { queryParamsHandling: 'preserve' });
  }

  public getEmptyQueryParams(params: Params): {
    [key: string]: null;
  } {
    const queryParams = {};
    Object.values(params).forEach(value => {
      Object.assign(queryParams, { [value]: null });
    });
    return queryParams;
  }
}
