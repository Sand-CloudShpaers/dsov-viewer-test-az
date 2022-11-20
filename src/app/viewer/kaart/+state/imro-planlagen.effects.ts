import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as SelectionActions from '~store/common/selection/+state/selection.actions';
import { concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { ImroPlanlagenService } from '~viewer/kaart/services/imro-planlagen.service';
import { Store } from '@ngrx/store';
import { State } from '~viewer/documenten/+state';
import { selectIhrSelections } from '~store/common/selection/+state/selection.selectors';
import * as KaartenImroActions from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.actions';
import * as MapDetailsActions from '~viewer/documenten/+state/map-details/map-details.actions';
import * as fromKaartenImro from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.selectors';
import { of } from 'rxjs';
import { SelectionObjectType } from '~store/common/selection/selection.model';

@Injectable()
export class ImroPlanlagenEffects {
  public showOnMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SelectionActions.showSelectionsOnMap),
      withLatestFrom(this.store.select(selectIhrSelections)),
      filter(([_action, selections]) => !!selections.length),
      map(([_action, selections]) => {
        const documentIds = selections.filter(sel => !!sel.documentDto).map(s => s.documentDto.documentId);
        return KaartenImroActions.loadStyleConfigs({ documentIds });
      })
    )
  );

  public showSelectionsWithStyle$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(KaartenImroActions.loadStylesSuccess),
        withLatestFrom(this.store.select(selectIhrSelections), this.store.select(fromKaartenImro.selectAll)),
        filter(([_action, selections, _kaartenImro]) => !!selections.length),
        map(([_action, selections, kaartenImro]) =>
          this.bestemmingsplanlagenService.resetStyleWithSelections(
            selections.map(x => ({
              locatieIds: x.locatieIds,
              documentId: x.documentDto?.documentId,
              symboolcode: x.symboolcode,
            })),
            kaartenImro.map(k => k.data.styles).flat()
          )
        )
      ),
    { dispatch: false }
  );

  public showMapDetailsWithSelections = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MapDetailsActions.showMapDetails),
        concatMap(action =>
          of(action).pipe(
            withLatestFrom(
              this.store.select(selectIhrSelections),
              this.store.select(fromKaartenImro.selectStyleConfigs(action.documentId))
            )
          )
        ),
        filter(([_action, _selectionFromStore, kaartenImro]) => !!kaartenImro.length),
        map(([action, selectionFromStore, kaartenImro]) => {
          const plangebied_grens = selectionFromStore.filter(
            selection => selection.objectType === SelectionObjectType.REGELINGSGEBIED
          );
          const selections = action.selections.concat(plangebied_grens);

          const kaartNamen = kaartenImro.map(kaart => kaart.naam);
          if (kaartNamen.includes(action.documentId)) {
            this.bestemmingsplanlagenService.resetStyleWithSelections(
              selections.map(x => ({
                locatieIds: x.locatieIds,
                documentId: x.documentDto?.documentId,
                symboolcode: x.symboolcode,
              })),
              kaartenImro
            );
          } else {
            this.bestemmingsplanlagenService.resetStyleWithCartografieInfo(
              action.documentId,
              selections.map(x => x.id),
              kaartenImro
            );
          }
        })
      ),
    { dispatch: false }
  );

  public resetMap$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectionActions.resetSelections),
        map(_action => {
          this.bestemmingsplanlagenService.resetSelections();
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private bestemmingsplanlagenService: ImroPlanlagenService
  ) {}
}
