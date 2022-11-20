import { SymboolLocatie } from '~store/common/selection/selection.model';
import { Store } from '@ngrx/store';
import { State } from '~viewer/documenten/+state';
import * as KaartenImroActions from './kaarten-imro.actions';
import { Injectable } from '@angular/core';
import { DocumentenStoreModule } from '~viewer/documenten/+state/documenten-store.module';

@Injectable({
  providedIn: DocumentenStoreModule,
})
export class KaartenImroFacade {
  constructor(private store: Store<State>) {}

  public getStyles(planId: string, symboolLocaties: SymboolLocatie[]): void {
    this.store.dispatch(KaartenImroActions.getStyles({ planId, symboolLocaties }));
  }

  public resetStyles(planId: string, symboolLocaties: SymboolLocatie[]): void {
    this.store.dispatch(KaartenImroActions.getStyles({ planId, symboolLocaties }));
  }
}
