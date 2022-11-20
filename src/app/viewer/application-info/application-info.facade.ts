import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '~store/state';
import * as ApplicationInfoActions from '~store/common/application-info/+state/application-info.actions';
import { Observable } from 'rxjs';
import { ApplicationInfo } from '~store/common/application-info/types/application-info';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { selectApplicationInfo, selectStatus } from '~store/common/application-info/+state/application-info.selectors';

@Injectable({ providedIn: 'root' })
export class ApplicationInfoFacade {
  constructor(private store: Store<State>) {}

  public readonly applicationInfoStatus$: Observable<DerivedLoadingState> = this.store.pipe(select(selectStatus));
  public readonly applicationInfo$: Observable<ApplicationInfo[]> = this.store.pipe(select(selectApplicationInfo));

  public getApplicationInfo(): void {
    this.store.dispatch(ApplicationInfoActions.load());
  }
}
