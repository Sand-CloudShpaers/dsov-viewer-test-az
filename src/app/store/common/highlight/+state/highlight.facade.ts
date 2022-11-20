import { Injectable } from '@angular/core';
import { HighlightStoreModule } from './highlight-store.module';
import * as HighlightActions from './highlight.actions';
import { select, Store } from '@ngrx/store';
import { State } from '~store/common';
import { selectHighlights } from './highlight.selectors';
import { Highlight } from '../types/highlight.model';

@Injectable({
  providedIn: HighlightStoreModule,
})
export class HighlightFacade {
  public readonly getHighlights$ = this.store.pipe(select(selectHighlights));

  constructor(private store: Store<State>) {}

  public startHighlight(highlight: Highlight): void {
    this.store.dispatch(HighlightActions.load(highlight));
  }

  public cancelHighlight(): void {
    this.store.dispatch(HighlightActions.cancel());
  }
}
