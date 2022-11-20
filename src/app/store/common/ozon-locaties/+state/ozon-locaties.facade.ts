import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OzonLocatiesStoreModule } from './ozon-locaties-store.module';
import * as fromOzonLocaties from '~store/common/ozon-locaties/+state/ozon-locaties.selectors';
import { State } from '~store/common';
import * as OzonLocatiesActions from './ozon-locaties.actions';

@Injectable({
  providedIn: OzonLocatiesStoreModule,
})
export class OzonLocatiesFacade {
  public readonly getOzonLocatiesStatus$ = this.store.pipe(select(fromOzonLocaties.selectOzonLocatiesStatus));
  public readonly getOzonLocatiesError$ = this.store.pipe(select(fromOzonLocaties.getOzonLocatiesError));
  public readonly getOzonLocaties$: Observable<string[]> = this.store.pipe(select(fromOzonLocaties.getOzonLocaties));
  public readonly getOzonOntwerpLocaties$: Observable<string[]> = this.store.pipe(
    select(fromOzonLocaties.getOzonOntwerpLocatieTechnischIds)
  );
  public resetState(): void {
    this.store.dispatch(OzonLocatiesActions.reset());
  }
  constructor(private store: Store<State>) {}
}
