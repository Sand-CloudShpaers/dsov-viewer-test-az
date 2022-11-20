import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createIhrPlanMock, createOntwerpRegelingMock, createRegelingMock } from '~mocks/documenten.mock';
import { LoadingState } from '~model/loading-state.enum';
import { State } from '~viewer/filtered-results/+state';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';
import * as PlannenActions from './plannen/plannen.actions';
import { searchKey } from '~store/state';
import { Bestuurslaag, BestuurslaagExtern } from '~viewer/documenten/types/documenten.model';
import { DocumentListItemVM, mapToDocumentListItem } from '~viewer/filtered-results/types/document-list-item';

describe('FilteredResultsFacade', () => {
  let filteredResultsFacade: FilteredResultsFacade;
  let store$: MockStore<State>;

  const ihrPlan = [createIhrPlanMock({ id: 'ihr_plan' })];
  const ozonPlan = [
    createRegelingMock({
      identificatie: 'ozon_regeling',
      aangeleverdDoorEen: {
        naam: 'leuke gemeente',
        code: 'gm123',
        bestuurslaag: BestuurslaagExtern.GEMEENTE,
      },
    }),
    createOntwerpRegelingMock({
      identificatie: 'ozon_ontwerpregeling',
      ontwerpbesluitIdentificatie: 'ozon_ontwerpbesluitIdentificatie',
      technischId: 'ozon_ontwerpregeling_ozon_ontwerpbesluitIdentificatie',
      aangeleverdDoorEen: {
        naam: 'leuke provincie',
        code: 'pv123',
        bestuurslaag: BestuurslaagExtern.PROVINCIE,
      },
    }),
  ];
  const initialState = {
    [searchKey]: {
      activeLocation: {
        name: 'empty',
      },
    },
    filter: {
      filterOptions: {
        documenttype: ['someOption'],
        regelsbeleid: [],
      },
    },
    filteredResults: {
      plannen: {
        ihr: {
          gemeente: {
            entities: {
              ['ihr_plan']: ihrPlan[0],
            },
            ids: ['ihr_plan'],
            loadMoreUrl: 'https://api.example.com/ihrplannen',
            status: LoadingState.RESOLVED,
          },
          provincie: {
            entities: {},
            ids: [],
            loadMoreUrl: null,
            status: null,
          },
          rijk: {
            entities: {},
            ids: [],
            loadMoreUrl: null,
            status: null,
          },
        },
        ozon: {
          entities: {
            ['ozon_regeling']: ozonPlan[0],
          },
          ids: ['ozon_regeling'],
          status: LoadingState.RESOLVED,
        },
        ozonOntwerp: {
          entities: {
            ['ozon_ontwerpregeling_ozon_ontwerpbesluitIdentificatie']: ozonPlan[1],
          },
          ids: ['ozon_ontwerpregeling_ozon_ontwerpbesluitIdentificatie'],
          status: LoadingState.RESOLVED,
        },
        isDirty: false,
        openSections: {
          gemeente: true,
          provincie: false,
          waterschap: false,
          rijk: false,
        },
      },
    },
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilteredResultsFacade,
        provideMockStore({
          initialState,
        }),
      ],
    });
    filteredResultsFacade = TestBed.inject(FilteredResultsFacade);
    store$ = TestBed.inject(MockStore);
    spyOn(store$, 'dispatch').and.stub();
  });

  describe('loadDocumenten', () => {
    it('should trigger plannen load', async () => {
      filteredResultsFacade.loadDocumenten();

      expect(store$.dispatch).toHaveBeenCalledWith(PlannenActions.load());
    });
  });

  describe('getLoadMoreUrl$', () => {
    it('should get loadMoreUrl for geldende regelgeving', done => {
      filteredResultsFacade.getLoadMoreUrls$(Bestuurslaag.GEMEENTE).subscribe(result => {
        expect(result).toEqual([{ bestuurslaag: Bestuurslaag.GEMEENTE, url: 'https://api.example.com/ihrplannen' }]);
        done();
      });
    });
  });

  describe('getStatus$', () => {
    it('should get status', done => {
      filteredResultsFacade.getStatus$().subscribe(result => {
        expect(result as LoadingState[]).toEqual([
          LoadingState.RESOLVED,
          null,
          null,
          LoadingState.RESOLVED,
          LoadingState.RESOLVED,
        ]);
        done();
      });
    });
  });

  describe('DocumentListItemsVM$', () => {
    it('should get listItems for gemeente', done => {
      filteredResultsFacade.getDocumentListItemsVM$(Bestuurslaag.GEMEENTE).subscribe(result => {
        expect(result as DocumentListItemVM[]).toEqual([
          mapToDocumentListItem(ihrPlan[0]),
          mapToDocumentListItem(ozonPlan[0]),
        ]);
        done();
      });
    });

    it('should get all documentlistItems', done => {
      filteredResultsFacade.getAllDocumentListItemsVM$().subscribe(result => {
        expect(result as DocumentListItemVM[]).toEqual([
          mapToDocumentListItem(ihrPlan[0]),
          mapToDocumentListItem(ozonPlan[0]),
          mapToDocumentListItem(ozonPlan[1]),
        ]);
        done();
      });
    });
  });

  describe('getSectionIsOpen$', () => {
    it('should get section isOpen', done => {
      filteredResultsFacade.getSectionIsOpen$(Bestuurslaag.GEMEENTE).subscribe(result => {
        expect(result as boolean).toEqual(true);
        done();
      });
    });
  });

  describe('toggleSection', () => {
    it('should trigger toggle section action', async () => {
      filteredResultsFacade.toggleSection(Bestuurslaag.GEMEENTE, false);

      expect(store$.dispatch).toHaveBeenCalledWith(
        PlannenActions.toggleSection({
          bestuurslaag: Bestuurslaag.GEMEENTE,
          open: false,
        })
      );
    });
  });

  describe('reset', () => {
    it('should trigger reset action', async () => {
      filteredResultsFacade.resetState();

      expect(store$.dispatch).toHaveBeenCalledWith(PlannenActions.reset());
    });
  });

  describe('loadMorePlannen', () => {
    const href = 'https://www.example.com';

    it('should dispatch with applicable action for geldende regelgeving', async () => {
      filteredResultsFacade.loadMore(Bestuurslaag.GEMEENTE, href);

      expect(store$.dispatch).toHaveBeenCalledWith(
        PlannenActions.ihrLoadMore({
          href,
          bestuurslaag: Bestuurslaag.GEMEENTE,
        })
      );
    });
  });

  describe('notAllFiltersApply$', () => {
    it('should check if a filter option not applicable to IHR has been set', done => {
      filteredResultsFacade.notAllFiltersApply$.subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });
    });

    it('should check if a filter option applicable to IHR has been set', done => {
      store$.setState({
        ...initialState,
        filter: {
          filterOptions: {
            ...initialState.filter.filterOptions,
            thema: ['themafilter'],
          },
        },
      });
      filteredResultsFacade.notAllFiltersApply$.subscribe(result => {
        expect(result).toBeTruthy();
        done();
      });
    });
  });
});
