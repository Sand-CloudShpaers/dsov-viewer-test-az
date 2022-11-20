import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectDocumentenState, State } from '~viewer/documenten/+state';
import * as fromKaartenImro from './kaarten-imro.reducer';
import { ImroKaartStyleConfig } from './kaarten-imro.model';
import { Style } from 'mapbox-gl';

const getKaartenImroState = createSelector(
  selectDocumentenState,
  state => state[fromKaartenImro.kaartenImroFeatureKey]
);

export const { selectEntities: selectKaartenImroEntities, selectAll } =
  fromKaartenImro.adapter.getSelectors(getKaartenImroState);

export const selectStyleConfigs = (documentId: string): MemoizedSelector<State, ImroKaartStyleConfig[]> =>
  createSelector(selectKaartenImroEntities, (kaartenImroEntities): ImroKaartStyleConfig[] =>
    kaartenImroEntities[documentId] ? Object.values(kaartenImroEntities[documentId].data.styles) : []
  );

export const selectStyleLookups = (documentId: string): MemoizedSelector<State, Style[]> =>
  createSelector(selectStyleConfigs(documentId), (configs): Style[] => configs.map(config => config.style));
