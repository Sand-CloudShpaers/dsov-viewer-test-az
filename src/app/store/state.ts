import { InjectionToken } from '@angular/core';
import { Action, ActionReducerMap, MetaReducer, RuntimeChecks } from '@ngrx/store';
import * as fromSearch from '~viewer/search/+state/search.reducer';
import * as fromSearchDocuments from '~search-documents/+state/search-documents.reducer';
import * as fromDocumentElementLink from '~viewer/documenten/+state/document-element-link/document-element-link.reducer';
import * as fromOverlay from '~viewer/overlay/+state/overlay.reducer';
import * as fromFilter from '~viewer/filter/+state/filter.reducer';
import * as fromActiviteiten from '~viewer/overzicht/activiteiten/+state/activiteiten.reducer';
import { logger } from '~general/build-specifics';
import * as fromCommon from '~store/common/index';
import * as fromFilteredResults from '~viewer/filtered-results/+state';

export const omgevingsplanPonsKey = 'omgevingsplanPons';
export const overlayPanelKey = 'overlaypanel';
export const documentElementLinkKey = 'documentElementLink';
export const searchKey = 'search';
export const filterKey = 'filter';
export const activiteitenKey = 'activiteiten';

export interface State {
  [activiteitenKey]: fromActiviteiten.State;
  [fromSearchDocuments.featureKey]: fromSearchDocuments.State;
  [searchKey]: fromSearch.State;
  [fromFilter.featureKey]: fromFilter.State;
  [overlayPanelKey]: fromOverlay.State;
  [documentElementLinkKey]: fromDocumentElementLink.State;
  [fromCommon.commonRootKey]: fromCommon.CommonState;
  [fromFilteredResults.filteredResultsFeatureRootKey]: fromFilteredResults.FilteredResultsState;
}

/**
 * @TODO migrate reducers & actions to `createAction` and `createReducer`, see https://medium.com/ngrx/announcing-ngrx-version-8-ngrx-data-create-functions-runtime-checks-and-mock-selectors-a44fac112627
 */
// eslint-disable-next-line
export const reducers: any = {
  [fromFilter.featureKey]: fromFilter.reducer,
  [overlayPanelKey]: fromOverlay.reducer,
  [documentElementLinkKey]: fromDocumentElementLink.reducer,
};

export const runtimeChecks: RuntimeChecks = {
  strictStateImmutability: false,
  strictActionImmutability: false,
  strictStateSerializability: false,
  strictActionSerializability: false,
  strictActionWithinNgZone: false,
};

// via een fileReplacement in angular.json wordt voor de production build een "dummy" logger functie gebruikt.
// in dev-mode wordt de logger functie met console.logs gebruikt.
export const metaReducers: MetaReducer<State>[] = [logger];

// ## setup DI

/**
 * @warning Nodig om known bug met ActionReducerMap-injectie en root reducers
 * te verhelpen in build
 * https://github.com/ngrx/store/issues/444#issuecomment-316045026
 */
export const reducerToken = new InjectionToken<ActionReducerMap<State>>('Root reducers token', {
  factory: (): ActionReducerMap<State, Action> => reducers,
});
