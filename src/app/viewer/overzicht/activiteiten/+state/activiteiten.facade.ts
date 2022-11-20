import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ActiviteitenGroepVM } from '~viewer/gebieds-info/types/gebieds-info.model';
import { Injectable } from '@angular/core';
import { State } from '~viewer/gebieds-info/+state';
import * as fromActiviteiten from './activiteiten.selectors';
import * as ActiviteitenActions from './activiteiten.actions';
import { ActiviteitenStoreModule } from './activiteiten-store.module';

@Injectable({
  providedIn: ActiviteitenStoreModule,
})
export class ActiviteitenFacade {
  public readonly getActiviteitenStatus$ = this.store.pipe(select(fromActiviteiten.getActiviteitenStatus));
  public readonly getActiviteitenGroepen$: Observable<ActiviteitenGroepVM[]> = this.store.pipe(
    select(fromActiviteiten.selectActiviteitenGroepen)
  );

  constructor(private store: Store<State>) {}

  public loadActiviteiten = (): void => this.store.dispatch(ActiviteitenActions.loadActiviteiten());

  public resetState(): void {
    this.store.dispatch(ActiviteitenActions.resetState());
  }
}
