import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectDocumentenState, State } from '~viewer/documenten/+state';
import * as fromKaarten from './kaarten.reducer';
import { DerivedLoadingState, derivedLoadingState } from '~general/utils/store.utils';
import { KaartVM } from '~viewer/annotaties/types/kaartenVM';
import { selectSelections } from '~store/common/selection/+state/selection.selectors';

const getKaarten = createSelector(selectDocumentenState, state => state[fromKaarten.kaartenFeatureKey]);

const { selectAll: selectKaarten } = fromKaarten.adapter.getSelectors(getKaarten);

export const selectKaartenStatusByDocumentId = (documentId: string): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(selectKaarten, (kaartenEntities): DerivedLoadingState => {
    const entity = kaartenEntities.find(item => item.entityId === documentId);
    return derivedLoadingState(entity?.status);
  });

export const selectKaartenByDocumentId = (documentId: string): MemoizedSelector<State, KaartVM[]> =>
  createSelector(selectKaarten, selectSelections, (kaartenEntities, selections): KaartVM[] => {
    const entity = kaartenEntities.find(item => item.entityId === documentId);
    const kaarten: KaartVM[] = entity?.data.map(kaart => ({
      identificatie: kaart.identificatie,
      nummer: kaart.nummer,
      naam: kaart.naam,
      isOntwerp: false,
      kaartlagen: kaart.bevat.map(laag => {
        const selection = selections?.find(x => x.id === laag.identificatie);
        return {
          identificatie: laag.identificatie,
          naam: laag.naam,
          niveau: laag.niveau,
          symboolcode: selection?.symboolcode,
          isSelected: !!selection,
        };
      }),
    }));
    // kaarten sorteren op nummer
    if (kaarten?.length > 1) {
      kaarten.sort((a, b) => (a.nummer > b.nummer ? 1 : b.nummer > a.nummer ? -1 : 0));
    }
    return kaarten ?? [];
  });
