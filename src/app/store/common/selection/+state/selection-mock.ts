import { Selection, SelectionObjectType } from '../selection.model';
import { ApiSource } from '~model/internal/api-source';
import { commonRootKey } from '~store/common';
import { selectionFeatureKey } from '~store/common/selection/+state/selection.reducer';
import { LoadingState } from '~model/loading-state.enum';
import initialState from '~mocks/initial-state';

export const selectionMock: Selection = {
  id: 'schaap',
  apiSource: ApiSource.OZON,
  objectType: SelectionObjectType.GEBIEDSAANWIJZING,
  symboolcode: 'vag123',
  name: 'mockje',
};

const GEBIEDSAANWIJZING = 'nl.imow-gm0297.gebiedsaanwijzing.2019000003';
const OMGEVINGSNORM = 'nl.imow-gm0297.omgevingsnorm.2019000003';
const OMGEVINGSNORMWAARDE = 'nl.imow-gm0297.omgevingsnorm.2019000003-10-meter';
const GEBIEDSAANDUIDING = 'gebiedsaanduiding';
const BESTEMMINGSVLAK = 'bestemmingsvlak';
const DOCUMENT_ID = '/akn/nl/act/1034';
const PLAN_ID = 'NL.IMRO.9925.SVOmgvisieGG-vst1';

export const selectionMockStore = {
  ...initialState,
  [commonRootKey]: {
    [selectionFeatureKey]: {
      ids: [GEBIEDSAANWIJZING, OMGEVINGSNORMWAARDE, DOCUMENT_ID, GEBIEDSAANDUIDING, BESTEMMINGSVLAK],
      entities: {
        [GEBIEDSAANWIJZING]: {
          status: LoadingState.RESOLVED,
          entityId: GEBIEDSAANWIJZING,
          data: {
            id: GEBIEDSAANWIJZING,
            apiSource: ApiSource.OZON,
            objectType: SelectionObjectType.GEBIEDSAANWIJZING,
            name: 'gebiedje',
          },
        },
        [OMGEVINGSNORMWAARDE]: {
          status: LoadingState.RESOLVED,
          entityId: OMGEVINGSNORMWAARDE,
          data: {
            id: OMGEVINGSNORMWAARDE,
            parentId: OMGEVINGSNORM,
            parentName: 'norm',
            apiSource: ApiSource.OZON,
            objectType: SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
            name: 'normwaarde',
          },
        },
        [DOCUMENT_ID]: {
          status: LoadingState.RESOLVED,
          entityId: DOCUMENT_ID,
          data: {
            id: DOCUMENT_ID,
            documentDto: {
              documentId: DOCUMENT_ID,
              documentType: 'regeling',
            },
            apiSource: ApiSource.OZON,
            objectType: SelectionObjectType.REGELINGSGEBIED,
            name: 'document',
          },
        },
        [PLAN_ID]: {
          status: LoadingState.RESOLVED,
          entityId: PLAN_ID,
          data: {
            id: PLAN_ID,
            documentDto: {
              documentId: 'NL.IMRO',
              documentType: 'bestemminsplan',
            },
            apiSource: ApiSource.IHR,
            objectType: SelectionObjectType.REGELINGSGEBIED,
            symboolHref: 'href',
            name: 'bestemmingsplan',
          },
        },
        [GEBIEDSAANDUIDING]: {
          status: LoadingState.RESOLVED,
          entityId: GEBIEDSAANDUIDING,
          data: {
            id: GEBIEDSAANDUIDING,
            apiSource: ApiSource.IHR,
            objectType: SelectionObjectType.GEBIEDSAANDUIDING,
            symboolHref: 'href',
            name: 'gebiedsaanduiding',
          },
        },
        [BESTEMMINGSVLAK]: {
          status: LoadingState.RESOLVED,
          entityId: BESTEMMINGSVLAK,
          data: {
            id: BESTEMMINGSVLAK,
            apiSource: ApiSource.IHR,
            objectType: SelectionObjectType.BESTEMMINGSVLAK,
            symboolHref: 'href',
            name: 'bestemmingsvlak',
          },
        },
      },
      error: Error,
    },
  },
};
