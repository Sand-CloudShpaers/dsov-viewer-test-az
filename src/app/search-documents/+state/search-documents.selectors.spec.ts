import { LoadingState } from '~model/loading-state.enum';
import { mockDocumenttypes } from '~viewer/filter/components/filter-documenttype/filter-documenttype.component.spec';
import { mockPlanSuggesties } from './search-documents.reducer.spec';
import { getSuggestions } from './search-documents.selectors';

describe('SearchDocumentsSelectors', () => {
  describe('getSuggestions, with no result ', () => {
    it('should return empty list', () => {
      expect(
        getSuggestions(mockDocumenttypes).projector({ plannen: [], regelingen: [], status: LoadingState.RESOLVED })
      ).toEqual([]);
    });
  });

  describe('getSuggestions, with  result ', () => {
    it('should return suggestions', () => {
      expect(
        getSuggestions(mockDocumenttypes).projector({
          plannen: mockPlanSuggesties,
          regelingen: undefined,
          status: LoadingState.RESOLVED,
        })
      ).toEqual([
        {
          id: 'id',
          value: 'bestemmingsplanNaam - goedgekeurd 12-12-2020 status id',
          type: 'bestemmingsplan',
          date: new Date('12-12-2020'),
        },
      ]);
    });
  });
});
