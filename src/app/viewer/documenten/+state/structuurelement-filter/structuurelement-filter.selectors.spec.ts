import * as fromSelectors from './structuurelement-filter.selectors';
import { StructuurElementFilter } from './structuurelement-filter.model';
import { FilterType } from '~viewer/documenten/utils/document-utils';
import { derivedLoadingState } from '~general/utils/store.utils';
import { LoadingState } from '~model/loading-state.enum';
import { documentDtoMock } from '~viewer/documenten/types/documentDto.mock';

export const mockStructuurElementenFilter: StructuurElementFilter = {
  id: 'documentId',
  document: documentDtoMock,
  beschrijving: 'hoofdlijn',
  filterType: FilterType.hoofdlijn,
  hoofdlijnId: 'hoofdlijnId',
  divisieannotaties: [],
};

describe('StructuurElementenFilter Selectors', () => {
  it('should return filter', () => {
    expect(
      fromSelectors.getFilterByDocumentId('documentId').projector({
        [mockStructuurElementenFilter.id]: {
          data: mockStructuurElementenFilter,
          entityId: mockStructuurElementenFilter.id,
          status: 'RESOLVED',
        },
      })
    ).toEqual(mockStructuurElementenFilter);
  });

  it('should return status', () => {
    expect(
      fromSelectors.getStatus('documentId').projector({
        [mockStructuurElementenFilter.id]: {
          data: mockStructuurElementenFilter,
          entityId: mockStructuurElementenFilter.id,
          status: 'RESOLVED',
        },
      })
    ).toEqual(derivedLoadingState(LoadingState.RESOLVED));
  });
});
