import { Injectable } from '@angular/core';
import { NavigationStoreModule } from './navigation-store.module';
import * as NavigationActions from './navigation.actions';
import { select, Store } from '@ngrx/store';
import { State } from '~store/common';
import * as fromNavigation from './navigation.selectors';
import { ViewerPage } from '~store/common/navigation/types/application-page';

@Injectable({
  providedIn: NavigationStoreModule,
})
export class NavigationFacade {
  public readonly previousPaths$ = this.store.pipe(select(fromNavigation.selectNavigationPaths));

  constructor(private store: Store<State>) {}

  public setNavigationPath(page: ViewerPage, path: string): void {
    this.store.dispatch(NavigationActions.setNavigationPath({ page, path }));
  }
}
