import { createServiceFactory, mockProvider, SpectatorService, SpyObject } from '@ngneat/spectator';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';
import * as DocumentVersiesActions from './document-versies.actions';
import { DocumentVersiesEffects } from './document-versies.effects';
import { OzonProvider } from '~providers/ozon.provider';
import initialState from '~mocks/initial-state';
import { createOntwerpRegelingMock, createRegelingMock } from '~mocks/documenten.mock';

describe('DocumentVersiesEffects', () => {
  let spectator: SpectatorService<DocumentVersiesEffects>;
  let actions$: Observable<Action>;
  let ozonProvider: SpyObject<OzonProvider>;
  let omgevingsdocumentService: SpyObject<OmgevingsDocumentService>;

  const vastgesteldId = 'vastgesteldId';
  const ontwerpId = 'ontwerpId';

  const ozonDocumentMock = createRegelingMock({ identificatie: vastgesteldId });
  const ozonOntwerpDocumentMock = createOntwerpRegelingMock({ identificatie: ontwerpId });
  const localIntialState = {
    ...initialState,
    documenten: {
      documenten: {
        entities: {
          [ontwerpId]: {
            data: {
              ihr: undefined,
              ozon: ozonOntwerpDocumentMock,
            },
            entityId: ontwerpId,
            error: undefined,
            status: 'RESOLVED',
          },
          [vastgesteldId]: {
            data: {
              ihr: undefined,
              ozon: ozonDocumentMock,
            },
            entityId: vastgesteldId,
            error: undefined,
            status: 'RESOLVED',
          },
        },
        ids: [ontwerpId, vastgesteldId],
      },
      documentVersies: {},
    },
  } as any;

  const createService = createServiceFactory({
    service: DocumentVersiesEffects,
    providers: [
      provideMockStore({ initialState: localIntialState }),
      provideMockActions(() => actions$),
      mockProvider(OzonProvider),
      mockProvider(OmgevingsDocumentService),
    ],
    mocks: [],
  });

  beforeEach(() => {
    spectator = createService();
    ozonProvider = spectator.inject(OzonProvider);
    omgevingsdocumentService = spectator.inject(OmgevingsDocumentService);
  });

  describe('loadVastgesteld', () => {
    it('should start loadingVastgesteld', done => {
      actions$ = of(DocumentVersiesActions.load({ documentId: vastgesteldId, isOntwerp: false }));
      spectator.service.loadVastgesteld$.subscribe(action => {
        expect(action).toEqual(
          DocumentVersiesActions.loadingVastgesteld({
            documentId: vastgesteldId,
            isOntwerp: false,
          })
        );
        done();
      });
    });
  });

  describe('loadingVastgesteldIfOntwerp', () => {
    it('should get vastgesteld from "opvolgerVan"', done => {
      omgevingsdocumentService.getRegeling$.and.returnValue(of(ozonDocumentMock));
      actions$ = of(DocumentVersiesActions.loadingVastgesteld({ documentId: ontwerpId, isOntwerp: true }));
      spectator.service.loadingVastgesteldFromOntwerpDocument$.subscribe(action => {
        expect(action).toEqual(
          DocumentVersiesActions.loadingVastgesteldSuccess({
            documentId: ontwerpId,
            regelingen: [ozonDocumentMock],
          })
        );
        done();
      });
    });
  });

  describe('loadOntwerpIfVastgesteld', () => {
    it('should start loading ontwerp', done => {
      actions$ = of(DocumentVersiesActions.load({ documentId: vastgesteldId, isOntwerp: false }));
      spectator.service.loadOntwerpIfVastgesteld$.subscribe(action => {
        expect(action).toEqual(
          DocumentVersiesActions.loadingOntwerp({
            documentId: vastgesteldId,
            hrefs: ['opvolger'],
          })
        );
        done();
      });
    });
  });

  describe('loadOntwerpIfOntwerp', () => {
    it('loading success with ontwerp document', done => {
      actions$ = of(DocumentVersiesActions.load({ documentId: ontwerpId, isOntwerp: true }));
      spectator.service.loadOntwerpIfOntwerp$.subscribe(action => {
        expect(action).toEqual(
          DocumentVersiesActions.loadingOntwerpSuccess({
            documentId: ontwerpId,
            regelingen: [ozonOntwerpDocumentMock],
          })
        );
        done();
      });
    });
  });

  describe('loadingVastgesteld', () => {
    it('should fetch voorkomens', done => {
      ozonProvider.fetchVoorkomens$.and.returnValue(
        of({
          _embedded: {
            voorkomens: [ozonDocumentMock],
          },
          _links: null,
          page: null,
        })
      );
      actions$ = of(DocumentVersiesActions.loadingVastgesteld({ documentId: vastgesteldId, isOntwerp: false }));
      spectator.service.loadingVastgesteld$.subscribe(action => {
        expect(action).toEqual(
          DocumentVersiesActions.loadingVastgesteldSuccess({
            documentId: vastgesteldId,
            regelingen: [ozonDocumentMock],
          })
        );
        done();
      });
    });
  });

  describe('loadingOntwerp', () => {
    it('should fetch ontwerpregelingen', done => {
      omgevingsdocumentService.get$.and.returnValue(of(ozonOntwerpDocumentMock));
      actions$ = of(DocumentVersiesActions.loadingOntwerp({ documentId: vastgesteldId, hrefs: ['href'] }));
      spectator.service.loadingOntwerp$.subscribe(action => {
        expect(action).toEqual(
          DocumentVersiesActions.loadingOntwerpSuccess({
            documentId: vastgesteldId,
            regelingen: [ozonOntwerpDocumentMock],
          })
        );
        done();
      });
    });
  });
});
