import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { createIhrPlanMock, createRegelingMock } from '~mocks/documenten.mock';
import { LoadingState } from '~model/loading-state.enum';
import * as DocumentStructuurActions from './document-structuur/document-structuur.actions';
import { documentStructuurFeatureKey } from './document-structuur/document-structuur.reducer';
import { DocumentenApiEffects } from './documenten-api.effects';
import * as DocumentenActions from './documenten/documenten.actions';
import * as RegelsOpMaatDocumentActions from '~viewer/regels-op-maat/+state/document/document.actions';
import { documentenFeatureKey } from './documenten/documenten.reducer';
import { documentFeatureRootKey, State } from './index';
import { OmgevingsDocumentService } from '../services/omgevings-document.service';
import { IhrDocumentService } from '../services/ihr-document.service';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { TekstCollectie } from '~ihr-model/tekstCollectie';
import { fakeAsync, tick } from '@angular/core/testing';
import { documentDtoMock } from '../types/documentDto.mock';
import * as fromDocumentLocatie from '~viewer/documenten/+state/document-locatie/document-locatie.reducer';

const omgevingsdocument = createRegelingMock();
const omgevingsdocumentId = omgevingsdocument.identificatie;

const ihrPlanResponse = createIhrPlanMock();
const ihrPlanResponseId = ihrPlanResponse.id;

describe('DocumentenApiEffects', () => {
  let spectator: SpectatorService<DocumentenApiEffects>;
  let actions$: Observable<Action>;
  let store$: MockStore<State>;
  let omgevingsDocumentService: SpyObject<OmgevingsDocumentService>;
  let ihrDocumentService: SpyObject<IhrDocumentService>;
  const initialState = {
    [documentFeatureRootKey]: {
      [fromDocumentLocatie.featureKey]: {
        entities: {},
        ids: [],
      },
      [documentenFeatureKey]: {
        ids: [],
        entities: {},
        selectedDocumentId: null,
      },
      [documentStructuurFeatureKey]: {
        ids: [],
        entities: {},
        selectedDocumentId: null,
      },
    },
  } as any;
  const createService = createServiceFactory({
    service: DocumentenApiEffects,
    providers: [
      provideMockStore({
        initialState,
      }),
      provideMockActions(() => actions$),
    ],
    mocks: [OmgevingsDocumentService, IhrDocumentService],
  });

  beforeEach(() => {
    spectator = createService();
    store$ = spectator.inject(MockStore);
    omgevingsDocumentService = spectator.inject(OmgevingsDocumentService);
    ihrDocumentService = spectator.inject(IhrDocumentService);
  });

  describe('loadDocument', () => {
    it('should handle ozon successfull api response', done => {
      omgevingsDocumentService.getRegeling$.and.returnValue(of(omgevingsdocument));
      actions$ = of(
        DocumentenActions.loadDocument({
          document: { documentId: omgevingsdocumentId },
          timeTravelDates: { geldigOp: '' },
          setAsSelected: false,
        })
      );

      spectator.service.loadRegeling$.subscribe(actual => {
        const expected = DocumentenActions.loadDocumentSuccess({
          ozon: omgevingsdocument,
          id: omgevingsdocumentId,
          setAsSelected: false,
        });

        expect(omgevingsDocumentService.getRegeling$).toHaveBeenCalledWith(omgevingsdocumentId, { geldigOp: '' });
        expect(omgevingsDocumentService.getOntwerpRegeling$).not.toHaveBeenCalled();
        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle ozon failed api response', done => {
      const error = new Error('stuk');
      omgevingsDocumentService.getRegeling$.and.returnValue(throwError(() => error));
      actions$ = of(
        DocumentenActions.loadDocument({ document: { documentId: omgevingsdocumentId }, setAsSelected: false })
      );

      spectator.service.loadRegeling$.subscribe(actual => {
        const expected = DocumentenActions.loadDocumentFailure({ id: omgevingsdocumentId, error });

        expect(omgevingsDocumentService.getRegeling$).toHaveBeenCalledWith(omgevingsdocumentId, undefined);
        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle ihr successfull api response', done => {
      ihrDocumentService.getIhrDocument$.and.returnValue(of(ihrPlanResponse));
      actions$ = of(
        DocumentenActions.loadDocument({ document: { documentId: ihrPlanResponseId }, setAsSelected: false })
      );

      spectator.service.loadPlan$.subscribe(actual => {
        const expected = DocumentenActions.loadDocumentSuccess({
          ihr: ihrPlanResponse,
          id: ihrPlanResponseId,
          setAsSelected: false,
        });

        expect(ihrDocumentService.getIhrDocument$).toHaveBeenCalledWith(ihrPlanResponseId);
        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle ihr failed api response', done => {
      const error = new Error('stuk');
      ihrDocumentService.getIhrDocument$.and.returnValue(throwError(() => error));
      actions$ = of(
        DocumentenActions.loadDocument({ document: { documentId: ihrPlanResponseId }, setAsSelected: false })
      );

      spectator.service.loadPlan$.subscribe(actual => {
        const expected = DocumentenActions.loadDocumentFailure({ id: ihrPlanResponseId, error });

        expect(ihrDocumentService.getIhrDocument$).toHaveBeenCalledWith(ihrPlanResponseId);
        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadRegelsOpMaatPerDocument', () => {
    it('should loadDocument', done => {
      actions$ = of(
        RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument({
          document: documentDtoMock,
        })
      );

      spectator.service.loadRegelsOpMaatPerDocument$.subscribe(actual => {
        const expected = DocumentenActions.loadDocument({
          document: documentDtoMock,
          setAsSelected: false,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadDocumentStructuurForSelectedDocument', () => {
    it('should load selected document from store and emit loadDocumentStructuur', done => {
      store$.setState({
        [documentFeatureRootKey]: {
          [fromDocumentLocatie.featureKey]: {
            entities: {},
            ids: [],
          },
          [documentenFeatureKey]: {
            ids: [omgevingsdocumentId],
            entities: {
              [omgevingsdocumentId]: {
                data: { ozon: omgevingsdocument },
                status: LoadingState.RESOLVED,
                entityId: omgevingsdocumentId,
              },
            },
            selectedDocumentId: omgevingsdocumentId,
          },
          [documentStructuurFeatureKey]: {
            ids: [],
            entities: {},
            selectedDocumentId: null,
          },
        },
      } as any);

      actions$ = of(DocumentStructuurActions.loadDocumentStructuurForSelectedDocument({ id: omgevingsdocumentId }));

      spectator.service.loadDocumentStructuurForOzon$.subscribe(actual => {
        const expected = DocumentStructuurActions.loadOzonDocumentStructuur({
          id: omgevingsdocumentId,
          href: 'https://geit.test/blaat/structuur',
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should load selected document from store and not emit loadDocumentStructuur when already fetched', () => {
      store$.setState({
        [documentFeatureRootKey]: {
          [fromDocumentLocatie.featureKey]: {
            entities: {},
            ids: [],
          },
          [documentenFeatureKey]: {
            ids: [omgevingsdocumentId],
            entities: {
              [omgevingsdocumentId]: {
                data: { ozon: omgevingsdocument },
                status: LoadingState.RESOLVED,
                entityId: omgevingsdocumentId,
              },
            },
            selectedDocumentId: omgevingsdocumentId,
          },
          [documentStructuurFeatureKey]: {
            ids: [omgevingsdocumentId],
            entities: {
              [omgevingsdocumentId]: {
                data: { ozon: omgevingsdocument },
                status: LoadingState.RESOLVED,
                entityId: omgevingsdocumentId,
              },
            },
          },
        },
      } as any);

      actions$ = hot('a', {
        a: DocumentStructuurActions.loadDocumentStructuurForSelectedDocument({
          id: omgevingsdocumentId,
        }),
      });

      const expected$ = cold('-', {});

      expect(spectator.service.loadDocumentStructuurForOzon$).toBeObservable(expected$);
    });

    it('should wait until there is a selected document', () => {
      store$.overrideSelector(omgevingsdocumentId, undefined);
      actions$ = hot('a', {
        a: DocumentStructuurActions.loadDocumentStructuurForSelectedDocument({
          id: omgevingsdocumentId,
        }),
      });
      const expected$ = cold('-', {});

      expect(spectator.service.loadDocumentStructuurForOzon$).toBeObservable(expected$);
    });
  });

  describe('loadDocumentStructuur', () => {
    it('should load OZON document structuur, when current document ApiSource is OZON', done => {
      store$.setState({
        [documentFeatureRootKey]: {
          [fromDocumentLocatie.featureKey]: {
            entities: {},
            ids: [],
          },
          [documentenFeatureKey]: {
            ids: [omgevingsdocumentId],
            entities: {
              [omgevingsdocumentId]: {
                data: { ozon: omgevingsdocument },
                status: LoadingState.RESOLVED,
                entityId: omgevingsdocumentId,
              },
            },
            selectedDocumentId: omgevingsdocumentId,
          },
          [documentStructuurFeatureKey]: {
            ids: [],
            entities: {},
            selectedDocumentId: null,
          },
        },
      } as any);
      actions$ = of(DocumentStructuurActions.loadDocumentStructuurForSelectedDocument({ id: omgevingsdocumentId }));

      spectator.service.loadDocumentStructuurForOzon$.subscribe(actual => {
        const expected = DocumentStructuurActions.loadOzonDocumentStructuur({
          id: omgevingsdocumentId,
          href: 'https://geit.test/blaat/structuur',
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should load IHR document structuur, when current document ApiSource is IHR', done => {
      store$.setState({
        [documentFeatureRootKey]: {
          [fromDocumentLocatie.featureKey]: {
            entities: {},
            ids: [],
          },
          [documentenFeatureKey]: {
            ids: [ihrPlanResponseId],
            entities: {
              [ihrPlanResponseId]: {
                data: { ihr: ihrPlanResponse },
                status: LoadingState.RESOLVED,
                entityId: ihrPlanResponseId,
              },
            },
            selectedDocumentId: ihrPlanResponseId,
          },
          [documentStructuurFeatureKey]: {
            ids: [],
            entities: {},
            selectedDocumentId: null,
          },
        },
      } as any);

      actions$ = of(
        DocumentStructuurActions.loadDocumentStructuurForSelectedDocument({
          id: ihrPlanResponseId,
          documentSubPagePaths: [DocumentSubPagePath.REGELS],
        })
      );

      spectator.service.loadDocumentStructuurForIhr$.subscribe(actual => {
        const expected = DocumentStructuurActions.loadIhrDocumentOnderdeel({
          id: ihrPlanResponseId,
          subPage: {
            path: DocumentSubPagePath.REGELS,
            label: 'Regels',
            href: 'https://example.com/objectgericht',
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadIhrDocumentStructuurSuccess', () => {
    it('should NOT load more teksten for ihr document that has NO next href', fakeAsync(() => {
      actions$ = of(
        DocumentStructuurActions.loadIhrDocumentStructuurSuccess({
          id: omgevingsdocumentId,
          data: { _links: { next: { href: '' } } } as TekstCollectie,
          parentId: 'dummy',
        })
      );

      let result;
      spectator.service.loadIhrDocumentStructuurSuccess$.subscribe(actual => (result = actual));
      tick(jasmine.DEFAULT_TIMEOUT_INTERVAL);

      expect(result).toBeUndefined();
    }));

    it('should load more teksten for ihr document that has next href and handle successfull api response', done => {
      ihrDocumentService.loadMoreIhrDocumentStructuur$.and.returnValue(
        of({
          _links: { next: { href: 'https://www.example.com?page=2' } },
        } as TekstCollectie)
      );
      actions$ = of(
        DocumentStructuurActions.loadIhrDocumentStructuurSuccess({
          id: omgevingsdocumentId,
          data: { _links: { next: { href: 'https://www.example.com' } } } as TekstCollectie,
          parentId: 'dummy',
        })
      );

      spectator.service.loadIhrDocumentStructuurSuccess$.subscribe(actual => {
        const expected = DocumentStructuurActions.loadIhrDocumentStructuurSuccess({
          id: omgevingsdocumentId,
          data: { _links: { next: { href: 'https://www.example.com?page=2' } } } as TekstCollectie,
          parentId: 'dummy',
          addition: true,
        });

        expect(ihrDocumentService.loadMoreIhrDocumentStructuur$).toHaveBeenCalledWith('https://www.example.com');
        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle failed api response', done => {
      const error = new Error('kaput');
      ihrDocumentService.loadMoreIhrDocumentStructuur$.and.returnValue(throwError(() => error));
      actions$ = of(
        DocumentStructuurActions.loadIhrDocumentStructuurSuccess({
          id: omgevingsdocumentId,
          data: { _links: { next: { href: 'https://www.example.com' } } } as TekstCollectie,
          parentId: 'dummy',
        })
      );

      spectator.service.loadIhrDocumentStructuurSuccess$.subscribe(actual => {
        const expected = DocumentStructuurActions.loadDocumentStructuurFailure({ id: omgevingsdocumentId, error });

        expect(ihrDocumentService.loadMoreIhrDocumentStructuur$).toHaveBeenCalledWith('https://www.example.com');
        expect(actual).toEqual(expected);
        done();
      });
    });
  });
});
