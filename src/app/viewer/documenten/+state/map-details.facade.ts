import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from './index';
import { KaartStoreModule } from '~viewer/kaart/+state/kaart-store.module';
import { HighlightService } from '~viewer/kaart/services/highlight.service';
import { Observable } from 'rxjs';
import { IhrProvider } from '~providers/ihr.provider';
import { map } from 'rxjs/operators';
import { Selection } from '~store/common/selection/selection.model';
import * as MapDetailsActions from '~viewer/documenten/+state/map-details/map-details.actions';
import { getMapDetailsStatus, selectMapDetails } from '~viewer/documenten/+state/map-details/map-details.selectors';
import { FeatureLike } from 'ol/Feature';
import { IMROCartografieInfoDetailVM } from '~viewer/documenten/types/map-details';
import { DerivedLoadingState } from '~general/utils/store.utils';

@Injectable({
  providedIn: KaartStoreModule,
})
export class MapDetailsFacade {
  public readonly mapDetailsStatus$: Observable<DerivedLoadingState> = this.store.pipe(select(getMapDetailsStatus()));
  public readonly mapDetails$ = this.store.pipe(select(selectMapDetails));

  constructor(
    private store: Store<State>,
    private highlightService: HighlightService,
    private ihrProvider: IhrProvider
  ) {}

  public getMaatvoeringLabels$(item: IMROCartografieInfoDetailVM, planId: string): Observable<string[]> {
    return this.ihrProvider
      .fetchMaatvoering$(item.id, planId)
      .pipe(map(response => response.omvang.map(x => `${x.naam}: ${x.waarde}`)));
  }

  public loadCartografie(documentId: string, features: FeatureLike[]): void {
    this.store.dispatch(MapDetailsActions.load({ documentId, features }));
  }

  public resetMapDetails(): void {
    this.store.dispatch(MapDetailsActions.reset());
  }

  public showMapDetails(selections: Selection[], documentId: string): void {
    this.store.dispatch(MapDetailsActions.showMapDetails({ documentId, selections }));
  }

  public addHighlight(documentId: string, locatieIds: string[]): void {
    this.highlightService.addHighlightLayerIHR(documentId, locatieIds);
  }

  public removeHighlight(): void {
    this.highlightService.removeHighlightLayer();
  }
}
