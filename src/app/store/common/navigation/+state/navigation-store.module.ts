import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import * as fromNavigation from '~store/common';

@NgModule({
  imports: [StoreModule.forFeature(fromNavigation.commonRootKey, fromNavigation.reducers)],
  providers: [],
})
export class NavigationStoreModule {}
