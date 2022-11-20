import { ApiSource } from '~model/internal/api-source';
import { LoadingState } from '~model/loading-state.enum';
import { SelectionObjectType } from '../selection.model';
import { selectionMock } from './selection-mock';
import { selectLegend } from './selection.selectors';

describe('SelectionSelectors', () => {
  it('should return legend', () => {
    expect(
      selectLegend.projector([
        {
          entityId: selectionMock.id,
          data: {
            id: 'regelingsgebied',
            objectType: SelectionObjectType.REGELINGSGEBIED,
            apiSource: ApiSource.OZON,
            symboolcode: 'regelingsgebied',
            name: 'regelingsgebied',
          },
          status: LoadingState.RESOLVED,
        },
        {
          entityId: selectionMock.id,
          data: selectionMock,
          status: LoadingState.RESOLVED,
        },
        {
          entityId: selectionMock.id,
          data: {
            id: 'normwaardeId',
            parentId: 'normId',
            parentName: 'norm',
            apiSource: ApiSource.OZON,
            objectType: SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
            symboolcode: 'vag123',
            name: 'normwaarde',
          },
          status: LoadingState.RESOLVED,
        },
      ])
    ).toEqual([
      {
        selections: [
          {
            id: 'regelingsgebied',
            objectType: SelectionObjectType.REGELINGSGEBIED,
            apiSource: ApiSource.OZON,
            symboolcode: 'regelingsgebied',
            name: 'regelingsgebied',
          },
        ],
      },
      {
        selections: [
          {
            id: 'schaap',
            apiSource: ApiSource.OZON,
            objectType: SelectionObjectType.GEBIEDSAANWIJZING,
            symboolcode: 'vag123',
            name: 'mockje',
          },
        ],
      },
      {
        id: 'normId',
        name: 'norm',
        selections: [
          {
            id: 'normwaardeId',
            parentId: 'normId',
            parentName: 'norm',
            apiSource: ApiSource.OZON,
            objectType: SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
            symboolcode: 'vag123',
            name: 'normwaarde',
          },
        ],
      },
    ]);
  });
});
