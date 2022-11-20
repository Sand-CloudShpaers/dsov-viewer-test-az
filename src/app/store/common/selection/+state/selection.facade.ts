import { Injectable } from '@angular/core';
import { SelectionStoreModule } from './selection-store.module';
import * as SelectionActions from './selection.actions';
import { select, Store } from '@ngrx/store';
import { State } from '~store/common';
import * as fromSelection from './selection.selectors';
import { Observable } from 'rxjs';
import { Selection } from '~store/common/selection/selection.model';
import { AnnotationId } from '~viewer/documenten/types/annotation';

@Injectable({
  providedIn: SelectionStoreModule,
})
export class SelectionFacade {
  public readonly getSelections$ = this.store.pipe(select(fromSelection.selectSelections));
  public readonly getDocumentSelections$ = this.store.pipe(select(fromSelection.selectDocumentSelections));
  public readonly legend$ = this.store.pipe(select(fromSelection.selectLegend));

  constructor(private store: Store<State>) {}

  public getSelectionByID$(elementId: string): Observable<boolean> {
    return this.store.pipe(select(fromSelection.getSelectionByID(elementId)));
  }

  public addSelections(selections: Selection[]): void {
    this.store.dispatch(SelectionActions.addSelections({ selections }));
  }

  public updateSelections(selections: Selection[]): void {
    this.store.dispatch(SelectionActions.updateSelections({ selections }));
  }

  public setSelectionsFromFilters(): void {
    this.store.dispatch(SelectionActions.setSelectionsFromFilters());
  }

  public showSelectionsOnMap(): void {
    this.store.dispatch(SelectionActions.showSelectionsOnMap());
  }

  public resetSelections(excludeDocuments: boolean): void {
    this.store.dispatch(SelectionActions.resetSelections({ excludeDocuments }));
  }

  public removeSelections(selections: Selection[]): void {
    this.store.dispatch(SelectionActions.removeSelections({ selections }));
  }

  public removeSelectionsForAnnotation(annotationId: AnnotationId): void {
    this.store.dispatch(SelectionActions.removeSelectionsForAnnotation(annotationId));
  }
}
