import { initialState, reducer } from './search-documents.reducer';
import * as SearchDocumentsActions from './search-documents.actions';
import { LoadingState } from '~model/loading-state.enum';
import { PlanSuggestieCollectie } from '~ihr-model/planSuggestieCollectie';
import { PlanType } from '~ihr-model/planType';
import { PlanstatusInfo } from '~ihr-model/planstatusInfo';
import { RegelingSuggestieCollectie } from '~ozon-model/regelingSuggestieCollectie';

export const mockPlanSuggesties: PlanSuggestieCollectie = {
  _embedded: {
    suggesties: [
      {
        id: 'id',
        type: PlanType.Bestemmingsplan,
        naam: 'bestemmingsplanNaam',
        planstatusInfo: {
          planstatus: PlanstatusInfo.PlanstatusEnum.Goedgekeurd,
          datum: '12-12-2020',
        },
        dossier: {
          id: 'id',
          status: 'status',
        },
      },
    ],
  },
};

export const mockRegelingSuggesties: RegelingSuggestieCollectie = {
  _embedded: {
    suggesties: [
      {
        citeerTitel: 'Omgevingsplan Amsterdam',
        identificatie: '/akn/nl/act/gm0363/2022/RegelingAmsterdam',
        bevoegdGezag: 'gm0363',
        type: '/join/id/stop/regelingtype_003',
      },
    ],
  },
};

describe('SearchDocumentsReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = reducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should have PENDING state', () => {
    const action = SearchDocumentsActions.SearchSuggestions;
    const actual = reducer(undefined, action as any);

    expect(actual).toEqual({ ...initialState, status: LoadingState.PENDING });
  });

  it('should have state with suggestions', () => {
    const action = SearchDocumentsActions.SearchSuggestionsSuccess({
      regelingen: mockRegelingSuggesties,
      plannen: mockPlanSuggesties,
    });
    const actual = reducer(undefined, action as any);

    expect(actual).toEqual({
      regelingen: mockRegelingSuggesties,
      plannen: mockPlanSuggesties,
      status: LoadingState.RESOLVED,
    });
  });

  it('should have state with error', () => {
    const action = SearchDocumentsActions.SearchSuggestionsError({
      error: null,
      value: 'tekst',
    });
    const actual = reducer(undefined, action as any);

    expect(actual).toEqual({
      ...initialState,
      error: null,
      status: LoadingState.REJECTED,
    });
  });

  it('should have initital state', () => {
    const action = SearchDocumentsActions.ResetSuggestions();
    const actual = reducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });
});
