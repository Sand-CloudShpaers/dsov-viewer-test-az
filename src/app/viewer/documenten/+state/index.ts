import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '~store/state';
import * as fromDocumentStructuur from './document-structuur/document-structuur.reducer';
import * as fromDocumenten from './documenten/documenten.reducer';
import * as fromLayout from './layout.reducer';
import * as fromRegeltekst from './regeltekst/regeltekst.reducer';
import * as fromHoofdlijnen from './hoofdlijnen/hoofdlijnen.reducer';
import * as fromBekendmakingen from './bekendmakingen/bekendmakingen.reducer';
import * as fromGerelateerdePlannen from './gerelateerde-plannen/gerelateerde-plannen.reducer';
import * as fromKaartenImro from './kaarten-imro/kaarten-imro.reducer';
import * as fromThemas from './themas/themas.reducer';
import * as fromDivisieannotaties from './divisieannotatie/divisieannotatie.reducer';
import * as fromKaarten from './kaarten/kaarten.reducer';
import * as fromDocumentStructuurelementenFilter from './structuurelement-filter/structuurelement-filter.reducer';
import * as fromDocumentLocatie from './document-locatie/document-locatie.reducer';
import * as fromMapDetails from './map-details/map-details.reducer';
import * as fromDocumentVersies from './document-versies/document-versies.reducer';

export const documentFeatureRootKey = 'documenten';

interface DocumentenState {
  readonly [fromDocumenten.documentenFeatureKey]: fromDocumenten.State;
  readonly [fromDocumentStructuur.documentStructuurFeatureKey]: fromDocumentStructuur.State;
  readonly [fromLayout.documentStructuurLayoutKey]: fromLayout.State;
  readonly [fromRegeltekst.regeltekstFeatureKey]: fromRegeltekst.State;
  readonly [fromHoofdlijnen.hoofdlijnFeatureKey]: fromHoofdlijnen.State;
  readonly [fromBekendmakingen.bekendmakingenFeatureKey]: fromBekendmakingen.State;
  readonly [fromGerelateerdePlannen.gerelateerdePlannenFeatureKey]: fromGerelateerdePlannen.State;
  readonly [fromKaartenImro.kaartenImroFeatureKey]: fromKaartenImro.State;
  readonly [fromThemas.themasFeatureKey]: fromThemas.State;
  readonly [fromDivisieannotaties.divisieannotatieFeatureKey]: fromDivisieannotaties.State;
  readonly [fromKaarten.kaartenFeatureKey]: fromKaarten.State;
  readonly [fromDocumentStructuurelementenFilter.documentStructuurelementFilterFeatureKey]: fromDocumentStructuurelementenFilter.State;
  readonly [fromDocumentLocatie.featureKey]: fromDocumentLocatie.State;
  readonly [fromMapDetails.featureKey]: fromMapDetails.State;
  readonly [fromDocumentVersies.featureKey]: fromDocumentVersies.State;
}

export interface State extends fromRoot.State {
  readonly [documentFeatureRootKey]: DocumentenState;
}

/** Provide reducer in AoT-compilation happy way */
export function reducers(state: DocumentenState | undefined, action: Action): DocumentenState {
  return combineReducers({
    [fromDocumenten.documentenFeatureKey]: fromDocumenten.reducer,
    [fromDocumentStructuur.documentStructuurFeatureKey]: fromDocumentStructuur.reducer,
    [fromLayout.documentStructuurLayoutKey]: fromLayout.reducer,
    [fromRegeltekst.regeltekstFeatureKey]: fromRegeltekst.reducer,
    [fromHoofdlijnen.hoofdlijnFeatureKey]: fromHoofdlijnen.reducer,
    [fromBekendmakingen.bekendmakingenFeatureKey]: fromBekendmakingen.reducer,
    [fromGerelateerdePlannen.gerelateerdePlannenFeatureKey]: fromGerelateerdePlannen.reducer,
    [fromKaartenImro.kaartenImroFeatureKey]: fromKaartenImro.reducer,
    [fromThemas.themasFeatureKey]: fromThemas.reducer,
    [fromDivisieannotaties.divisieannotatieFeatureKey]: fromDivisieannotaties.reducer,
    [fromKaarten.kaartenFeatureKey]: fromKaarten.reducer,
    [fromDocumentStructuurelementenFilter.documentStructuurelementFilterFeatureKey]:
      fromDocumentStructuurelementenFilter.reducer,
    [fromDocumentLocatie.featureKey]: fromDocumentLocatie.reducer,
    [fromMapDetails.featureKey]: fromMapDetails.reducer,
    [fromDocumentVersies.featureKey]: fromDocumentVersies.reducer,
  })(state, action);
}

export const selectDocumentenState = createFeatureSelector<DocumentenState>(documentFeatureRootKey);
