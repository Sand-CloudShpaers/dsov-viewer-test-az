// Modules
import Point from 'ol/geom/Point';

// Common
import { commonRootKey } from '~store/common/index';
import {
  initialState as selectionInitialState,
  selectionFeatureKey,
} from '~store/common/selection/+state/selection.reducer';
import {
  initialState as ozonLocatiesInitialState,
  ozonLocatiesRootKey,
} from '~store/common/ozon-locaties/+state/ozon-locaties.reducer';

// Documenten
import { documentFeatureRootKey } from '~viewer/documenten/+state';
import * as fromDocumenten from '~viewer/documenten/+state/documenten/documenten.reducer';
import * as fromDocumentLayout from '~viewer/documenten/+state/layout.reducer';
import * as fromDocumentStructuur from '~viewer/documenten/+state/document-structuur/document-structuur.reducer';
import * as fromDivisies from '~viewer/documenten/+state/divisieannotatie/divisieannotatie.reducer';
import * as fromRegeltekst from '~viewer/documenten/+state/regeltekst/regeltekst.reducer';
import * as fromStructuurElementFilter
  from '~viewer/documenten/+state/structuurelement-filter/structuurelement-filter.reducer';
import * as fromDocumentLocatie from '~viewer/documenten/+state/document-locatie/document-locatie.reducer';
import * as fromDocumentVersies from '~viewer/documenten/+state/document-versies/document-versies.reducer';
import * as fromMapDetails from '~viewer/documenten/+state/map-details/map-details.reducer';

// State
import { omgevingsplanPonsKey, searchKey, State } from '~store/state';

// Other
import { annotatiesInitialState } from '~viewer/annotaties/+state';
import { filteredResultsFeatureRootKey } from '~viewer/filtered-results/+state';
import { gebiedsInfoInitialState } from '~viewer/gebieds-info/+state';

import * as fromPlannen from '~viewer/filtered-results/+state/plannen/plannen.reducer';
import { LoadingState } from '~model/loading-state.enum';

/**
 * This file by default exports a dummy initialState for use in tests
 * It should include usefull but empty values for relevant keys to avoid
 * tests failing on missing keys or objects.
 *
 * When an actual value in state is needed, the createStateFromProps() function
 * can be called with the relevant parameters.
 * When adding parameters, make sure to add an empty value and add a line to the
 * parameter list below. Note all parameterss are children of the props object
 * so calling function can simply be called with only the relevant parameter
 * specified like so: createStateFromProps({ param })
 * @param activeLocation An OlGeometery object (typically a point) for activeLocation
 */

interface Props {
  activeLocation?: Point;
  filteredResults?: {
    layout: {
      activeTab: string;
    };
  };
}

const createStateWithProps = (props: Props): State =>
  ({
    [omgevingsplanPonsKey]: { omgevingsplanPons: true },
    [searchKey]: {
      activeLocation: { geometry: props?.activeLocation || new Point([0, 1]) },
      status: LoadingState.RESOLVED,
    },
    filter: { filterOptions: {} },
    [filteredResultsFeatureRootKey]: {
      [fromPlannen.plannenRootKey]: fromPlannen.initialState,
    },
    [documentFeatureRootKey]: {
      [fromDocumenten.documentenFeatureKey]: fromDocumenten.initialState,
      [fromDocumentStructuur.documentStructuurFeatureKey]: fromDocumentStructuur.initialState,
      [fromDocumentLayout.documentStructuurLayoutKey]: fromDocumentLayout.initialState,
      [fromDivisies.divisieannotatieFeatureKey]: fromDivisies.initialState,
      [fromRegeltekst.regeltekstFeatureKey]: fromRegeltekst.initialState,
      [fromStructuurElementFilter.documentStructuurelementFilterFeatureKey]: fromStructuurElementFilter.initialState,
      [fromDocumentLocatie.featureKey]: fromDocumentLocatie.initialState,
      [fromDocumentVersies.featureKey]: fromDocumentVersies.initialState,
      [fromMapDetails.featureKey]: fromMapDetails.initialState,
    },
    [commonRootKey]: {
      [selectionFeatureKey]: selectionInitialState,
      [ozonLocatiesRootKey]: ozonLocatiesInitialState,
    },
    ...annotatiesInitialState,
    ...gebiedsInfoInitialState,
  } as any);

const initialState = createStateWithProps({});

export default initialState;
