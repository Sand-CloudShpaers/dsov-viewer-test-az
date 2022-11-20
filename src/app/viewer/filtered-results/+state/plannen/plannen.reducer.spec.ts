import { initialState, reducer as plannenReducer } from './plannen.reducer';
import * as PlannenActions from '~viewer/filtered-results/+state/plannen/plannen.actions';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';
import { LoadingState } from '~model/loading-state.enum';
import { PlannenState } from '~viewer/filtered-results/+state/plannen/types/plannenState';
import { createIhrPlanMock, createOntwerpRegelingMock, createRegelingMock } from '~mocks/documenten.mock';

const pendingStateIhr = {
  ...initialState,
  ihr: {
    ...initialState.ihr,
    gemeente: {
      ...initialState.ihr.gemeente,
      status: LoadingState.PENDING,
    },
  },
} as PlannenState;

const pendingStateOzon = {
  ...initialState,
  ozon: {
    ...initialState.ozon,
    status: LoadingState.PENDING,
  },
} as PlannenState;

const pendingStateOzonOntwerp = {
  ...initialState,
  ozonOntwerp: {
    ...initialState.ozonOntwerp,
    status: LoadingState.PENDING,
  },
} as PlannenState;

const rejectedStateIhr = {
  ...initialState,
  ihr: {
    ...initialState.ihr,
    provincie: {
      ...initialState.ihr.provincie,
      status: LoadingState.REJECTED,
    },
  },
} as PlannenState;

const rejectedStateOzon = {
  ...initialState,
  ozon: {
    ...initialState.ozon,
    status: LoadingState.REJECTED,
  },
} as PlannenState;

const rejectedStateOzonOntwerp = {
  ...initialState,
  ozonOntwerp: {
    ...initialState.ozonOntwerp,
    status: LoadingState.REJECTED,
  },
} as PlannenState;

const filledStateIhr = {
  ...initialState,
  ihr: {
    ...initialState.ihr,
    gemeente: {
      ...initialState.ihr.gemeente,
      status: LoadingState.RESOLVED,
      ids: ['ihr_plan'],
      entities: { ihr_plan: createIhrPlanMock({ id: 'ihr_plan' }) },
    },
  },
} as PlannenState;

const filledStateOzon = {
  ...initialState,
  ozon: {
    ...initialState.ozon,
    status: LoadingState.RESOLVED,
    ids: ['ozon_regeling'],
    entities: { ozon_regeling: createRegelingMock({ identificatie: 'ozon_regeling' }) },
  },
} as PlannenState;

const filledStateOzonOntwerp = {
  ...initialState,
  ozonOntwerp: {
    ...initialState.ozonOntwerp,
    status: LoadingState.RESOLVED,
    ids: ['ozon_regeling_ontwerp'],
    entities: { ozon_regeling_ontwerp: createOntwerpRegelingMock({ technischId: 'ozon_regeling_ontwerp' }) },
  },
} as PlannenState;

const loadMoreUrlStateIhr = {
  ...filledStateIhr,
  ihr: {
    ...filledStateIhr.ihr,
    provincie: {
      ...filledStateIhr.ihr.provincie,
      loadMoreUrl: 'urlVoorMeer',
    },
  },
} as PlannenState;

const loadMoreStateIhr = {
  ...filledStateIhr,
  ihr: {
    ...filledStateIhr.ihr,
    gemeente: {
      ...filledStateIhr.ihr.gemeente,
      status: LoadingState.RESOLVED,
      ids: ['ihr_plan', 'nog_een_ihr_plan', 'en_het_laatste_plan'],
      entities: {
        ihr_plan: createIhrPlanMock({ id: 'ihr_plan' }),
        nog_een_ihr_plan: createIhrPlanMock({ id: 'nog_een_ihr_plan' }),
        en_het_laatste_plan: createIhrPlanMock({ id: 'en_het_laatste_plan' }),
      },
    },
  },
} as PlannenState;

const loadMoreStateOzon = {
  ...filledStateOzon,
  ozon: {
    ...filledStateOzon.ozon,
    status: LoadingState.RESOLVED,
    ids: ['ozon_regeling', 'nog_een_ozon_document', 'en_het_laatste_document'],
    entities: {
      ozon_regeling: createRegelingMock({ identificatie: 'ozon_regeling' }),
      nog_een_ozon_document: createRegelingMock({ identificatie: 'nog_een_ozon_document' }),
      en_het_laatste_document: createRegelingMock({ identificatie: 'en_het_laatste_document' }),
    },
  },
} as PlannenState;

const loadMoreStateOzonOntwerp = {
  ...filledStateOzonOntwerp,
  ozonOntwerp: {
    ...filledStateOzonOntwerp.ozonOntwerp,
    status: LoadingState.RESOLVED,
    ids: ['ozon_regeling_ontwerp', 'nog_een_ozon_document_ontwerp', 'en_het_laatste_document_ontwerp'],
    entities: {
      ozon_regeling_ontwerp: createOntwerpRegelingMock({ technischId: 'ozon_regeling_ontwerp' }),
      nog_een_ozon_document_ontwerp: createOntwerpRegelingMock({ technischId: 'nog_een_ozon_document_ontwerp' }),
      en_het_laatste_document_ontwerp: createOntwerpRegelingMock({ technischId: 'en_het_laatste_document_ontwerp' }),
    },
  },
} as PlannenState;

const changedToggleState = {
  ...initialState,
  openSections: {
    ...initialState.openSections,
    gemeente: false,
  },
} as PlannenState;

const dirtyState = {
  ...initialState,
  isDirty: true,
} as PlannenState;

describe('filtered results plannenReducer', () => {
  describe('load Ihr plannen', () => {
    it('should have initial state', () => {
      const actual = initialState;

      expect(actual).toEqual(initialState);
    });

    it('should set pending state Ihr', () => {
      const action = PlannenActions.ihrLoading({
        bestuurslaag: Bestuurslaag.GEMEENTE,
      });
      const actual = plannenReducer(initialState, action);

      expect(actual).toEqual(pendingStateIhr);
    });

    it('should set rejected state Ihr', () => {
      const action = PlannenActions.ihrLoadError({
        error: new Error(),
        bestuurslaag: Bestuurslaag.PROVINCIE,
      });
      const actual = plannenReducer(initialState, action);

      expect(actual).toEqual(rejectedStateIhr);
    });

    it('should set plannen in store', () => {
      const action = PlannenActions.ihrLoadSuccess({
        ihrPlannen: [createIhrPlanMock({ id: 'ihr_plan' })],
        bestuurslaag: Bestuurslaag.GEMEENTE,
      });
      const actual = plannenReducer(initialState, action);

      expect(actual).toEqual(filledStateIhr);
    });

    it('should set nextUrl for Ihr', () => {
      const action = PlannenActions.ihrSetNextUrl({
        bestuurslaag: Bestuurslaag.PROVINCIE,
        href: 'urlVoorMeer',
      });
      const actual = plannenReducer(filledStateIhr, action);

      expect(actual).toEqual(loadMoreUrlStateIhr);
    });

    it('should loadMore Ihr', () => {
      const action = PlannenActions.ihrLoadMoreSuccess({
        ihrPlannen: [createIhrPlanMock({ id: 'nog_een_ihr_plan' }), createIhrPlanMock({ id: 'en_het_laatste_plan' })],
        bestuurslaag: Bestuurslaag.GEMEENTE,
      });
      const actual = plannenReducer(filledStateIhr, action);

      expect(actual).toEqual(loadMoreStateIhr);
    });
  });

  describe('load Ozon documenten', () => {
    it('should set pending state Ozon', () => {
      const action = PlannenActions.ozonLoading({ loadMore: true });
      const actual = plannenReducer(initialState, action);

      expect(actual).toEqual(pendingStateOzon);
    });

    it('should set rejected state Ozon', () => {
      const action = PlannenActions.ozonLoadError({
        error: new Error(),
      });
      const actual = plannenReducer(initialState, action);

      expect(actual).toEqual(rejectedStateOzon);
    });

    it('should set documenten in store', () => {
      const action = PlannenActions.ozonLoadSuccess({
        regelingen: [createRegelingMock({ identificatie: 'ozon_regeling' })],
        omgevingsvergunningen: [],
      });
      const actual = plannenReducer(initialState, action);

      expect(actual).toEqual(filledStateOzon);
    });

    it('should loadMore Ozon', () => {
      const action = PlannenActions.ozonLoadMoreSuccess({
        regelingen: [
          createRegelingMock({ identificatie: 'nog_een_ozon_document' }),
          createRegelingMock({ identificatie: 'en_het_laatste_document' }),
        ],
      });
      const actual = plannenReducer(filledStateOzon, action);

      expect(actual).toEqual(loadMoreStateOzon);
    });
  });

  describe('load Ozon ontwerp regelingen', () => {
    it('should set pending state Ozon ontwerp', () => {
      const action = PlannenActions.ozonOntwerpLoading({ loadMore: true });
      const actual = plannenReducer(initialState, action);

      expect(actual).toEqual(pendingStateOzonOntwerp);
    });

    it('should set rejected state Ozon ontwerp', () => {
      const action = PlannenActions.ozonOntwerpLoadError({
        error: new Error(),
      });
      const actual = plannenReducer(initialState, action);

      expect(actual).toEqual(rejectedStateOzonOntwerp);
    });

    it('should set ontwerp documenten in store', () => {
      const action = PlannenActions.ozonOntwerpLoadSuccess({
        ontwerpRegelingen: [
          createOntwerpRegelingMock({
            technischId: 'ozon_regeling_ontwerp',
          }),
        ],
      });
      const actual = plannenReducer(initialState, action);

      expect(actual).toEqual(filledStateOzonOntwerp);
    });

    it('should loadMore Ozon Ontwerp', () => {
      const action = PlannenActions.ozonOntwerpLoadMoreSuccess({
        ontwerpRegelingen: [
          createOntwerpRegelingMock({
            technischId: 'nog_een_ozon_document_ontwerp',
          }),
          createOntwerpRegelingMock({
            technischId: 'en_het_laatste_document_ontwerp',
          }),
        ],
      });
      const actual = plannenReducer(filledStateOzonOntwerp, action);

      expect(actual).toEqual(loadMoreStateOzonOntwerp);
    });
  });

  describe('toggleSection', () => {
    it('should toggle section state (open) per bestuurslaag', () => {
      const action = PlannenActions.toggleSection({ bestuurslaag: Bestuurslaag.GEMEENTE, open: false });
      const actual = plannenReducer(initialState, action);

      expect(actual).toEqual(changedToggleState);
    });
  });

  describe('setDirty', () => {
    it('should reset to initialState and should set Dirty true', () => {
      const action = PlannenActions.reset;
      const actual = plannenReducer(initialState, action);

      expect(actual).toEqual(dirtyState);
    });

    it('should set Dirty false', () => {
      const action = PlannenActions.setNotDirty();
      const actual = plannenReducer(dirtyState, action);

      expect(actual).toEqual(initialState);
    });
  });
});
