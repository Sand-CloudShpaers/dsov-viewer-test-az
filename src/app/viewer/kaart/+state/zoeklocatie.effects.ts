import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { ZoeklocatielaagService } from '~viewer/kaart/services/zoeklocatielaag.service';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import * as FilterActions from '~viewer/filter/+state/filter.actions';
import { State } from '~store/state';
import { LocationType } from '~model/internal/active-location-type.model';
import { isLocationFilterComplete } from '~viewer/filter/helpers/filters';
import { FilterName } from '~viewer/filter/types/filter-options';

@Injectable()
export class ZoeklocatieEffects {
  public showZoekLocatieOnMap$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FilterActions.PreviewFilters, FilterActions.UpdateFilters),
        filter(action => isLocationFilterComplete(action.filterOptions)),
        map(action => {
          const locatie = action.filterOptions.locatie[0];
          const verbeeldingen = [
            {
              id: locatie.gemeentecode ? locatie.gemeentecode : locatie.name,
              geometrie: locatie.geometry,
              huisnummer: locatie.huisnummer,
            },
          ];

          if (verbeeldingen[0].geometrie) {
            this.zoeklocatielaagService.removeFeatures();
            const zoekFeature = this.zoeklocatielaagService.addZoeklocatie(verbeeldingen[0].geometrie);
            if (locatie?.source === LocationType.CoordinatenRD || locatie?.source === LocationType.CoordinatenETRS89) {
              if (!locatie.noZoom) {
                this.kaartService.zoomToExtent(zoekFeature.getGeometry().getExtent(), 200);
              }
            } else {
              this.kaartService.removePin();
              // padding top = 50 for label placing
              this.kaartService.zoomToExtent(zoekFeature.getGeometry().getExtent(), 0, [50, 10, 10, 10]);
              if (locatie) {
                this.zoeklocatielaagService.addLabel(locatie);
              }
            }
          }
        })
      ),
    { dispatch: false }
  );

  public resetLocatieFilter$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FilterActions.ResetFilters),
        filter(action => action.filterNames.includes(FilterName.LOCATIE)),
        map(() => {
          this.zoeklocatielaagService.removeFeatures();
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private zoeklocatielaagService: ZoeklocatielaagService,
    private kaartService: KaartService,
    private store: Store<State>
  ) {}
}
