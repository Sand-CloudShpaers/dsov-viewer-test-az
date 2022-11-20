import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { DocumentElementLinkEffects } from '~viewer/documenten/+state/document-element-link/document-element-link.effects';
import { IhrDocumentService } from '~viewer/documenten/services/ihr-document.service';
import * as FromDocumentElementLinkActions from '~viewer/documenten/+state/document-element-link/document-element-link.actions';
import { ihrDocumentElementResponse } from '~viewer/documenten/+state/document-element-link/document-element.mock';
import { LoadingState } from '~model/loading-state.enum';
import { IhrDocumentHtmlService } from '~viewer/documenten/services/ihr-document-html.service';
import { createIhrPlanMock, createRegelingMock } from '~mocks/documenten.mock';
import * as fromDocumentLocatie from '~viewer/documenten/+state/document-locatie/document-locatie.reducer';

describe('DocumentElementLinkEffects', () => {
  let spectator: SpectatorService<DocumentElementLinkEffects>;
  let actions$: Observable<Action>;
  let ihrDocumentService: SpyObject<IhrDocumentService>;
  const ozonDocumentMock = createRegelingMock({ identificatie: 'testOzon' });
  const ihrPlanMock = createIhrPlanMock();
  const localIntialState = {
    ...initialState,
    documenten: {
      [fromDocumentLocatie.featureKey]: {
        entities: {},
        ids: [],
      },
      documenten: {
        entities: {
          testOzon: {
            data: {
              ihr: undefined,
              ozon: ozonDocumentMock,
            },
            entityId: 'testOzon',
            error: undefined,
            status: 'RESOLVED',
          },
          'NL.IMRO.0983.BP201816MANRESA-VA01': {
            data: {
              ihr: ihrPlanMock,
              ozon: undefined,
            },
            entityId: 'NL.IMRO.0983.BP201816MANRESA-VA01',
            error: undefined,
            status: 'RESOLVED',
          },
        },
        ids: ['testOzon', 'NL.IMRO.0983.BP201816MANRESA-VA01'],
        selectedDocumentId: 'NL.IMRO.0983.BP201816MANRESA-VA01',
      },
      'document-structuur': {
        entities: {
          testOzon: {
            data: {
              ozon: {
                regels: {
                  ihrDocumentElementResponse,
                },
              },
            },
          },
        },
      },
      'document-structuur-layout': {
        collapse: {},
        annotaties: {},
      },
      regelteksten: {},
      'structuurelement-regelteksten': {},
      divisies: {},
      'structuurelement-divisies': {},
      divisieteksten: {},
      'structuurelement-divisieteksten': {},
    },
  } as any;

  const createService = createServiceFactory({
    service: DocumentElementLinkEffects,
    providers: [provideMockActions(() => actions$), provideMockStore({ initialState: localIntialState })],
    mocks: [IhrDocumentService, IhrDocumentHtmlService],
  });

  beforeEach(() => {
    spectator = createService();
    ihrDocumentService = spectator.inject(IhrDocumentService);
  });

  it('should trigger loadIhrDocumentElement', () => {
    actions$ = of(
      FromDocumentElementLinkActions.storeDocumentElementLink({
        documentId: 'NL.IMRO.en.de.rest',
        elementId: 'elementId',
      })
    );
    spectator.service.loadDocumentElementById$.subscribe(fromAction => {
      expect(fromAction).toEqual(
        FromDocumentElementLinkActions.loadIhrDocumentElement({
          documentId: 'NL.IMRO.en.de.rest',
          elementId: 'elementId',
        })
      );
    });
  });

  it('should set status to PENDING on loadIhrDocumentElement', () => {
    actions$ = of(
      FromDocumentElementLinkActions.loadIhrDocumentElement({
        documentId: 'NL.IMRO.0983.BP201816MANRESA-VA01',
        elementId: 'elementId',
      })
    );
    spectator.service.startShowDocumentElementLinkResult$.subscribe(fromAction => {
      expect(fromAction).toEqual(
        FromDocumentElementLinkActions.showDocumentElementLinkResult({
          content: '',
          documentId: 'NL.IMRO.0983.BP201816MANRESA-VA01',
          title: 'Nieuw Manresa',
          subtitle: 'Gemeente Venlo',
          loadingStatus: LoadingState.PENDING,
        })
      );
    });
  });

  it('should trigger loadOzonLinkTekst', () => {
    actions$ = of(
      FromDocumentElementLinkActions.storeDocumentElementLink({
        documentId: 'documentId',
        elementId: 'elementId',
      })
    );
    spectator.service.loadDocumentElementById$.subscribe(fromAction => {
      expect(fromAction).toEqual(
        FromDocumentElementLinkActions.loadOzonLinkTekst({
          documentId: 'documentId',
          elementId: 'elementId',
          nodeType: undefined,
        })
      );
    });
  });

  it('should trigger loadDocumentElementSucces', () => {
    ihrDocumentService.getIhrDocumentElementById$.and.returnValue(of(ihrDocumentElementResponse));
    actions$ = of(
      FromDocumentElementLinkActions.loadIhrDocumentElement({
        documentId: 'documentId',
        elementId: 'elementId',
      })
    );

    spectator.service.getIhrDocumentElementById$.subscribe(fromAction => {
      expect(fromAction).toEqual(
        FromDocumentElementLinkActions.loadIhrDocumentElementSucces({
          documentId: 'documentId',
          elementId: 'elementId',
          tekst: ihrDocumentElementResponse,
        })
      );
    });
  });

  it('should trigger loadDocumentElementFailure', () => {
    const documentElementError = new Error('failure');
    ihrDocumentService.getIhrDocumentElementById$.and.returnValue(throwError(() => documentElementError));
    actions$ = of(
      FromDocumentElementLinkActions.loadIhrDocumentElement({
        documentId: 'documentId',
        elementId: 'elementId',
      })
    );
    spectator.service.getIhrDocumentElementById$.subscribe(fromAction => {
      expect(fromAction).toEqual(
        FromDocumentElementLinkActions.loadDocumentElementFailure({
          documentId: 'documentId',
          elementId: 'elementId',
          error: documentElementError,
        })
      );
    });
  });

  it('should trigger showDocumentElementLinkResult for IHR DocumentElement', () => {
    spyOn(IhrDocumentHtmlService, 'getHtmlFromTekst').and.returnValue('Dit is content voor een Ihr documentElement');
    actions$ = of(
      FromDocumentElementLinkActions.loadIhrDocumentElementSucces({
        documentId: 'NL.IMRO.0983.BP201816MANRESA-VA01',
        elementId: 'elementId',
        tekst: ihrDocumentElementResponse,
      })
    );
    spectator.service.showDocumentElementWithContent$.subscribe(fromAction => {
      expect(fromAction).toEqual(
        FromDocumentElementLinkActions.showDocumentElementLinkResult({
          content: 'Dit is content voor een Ihr documentElement',
          documentId: 'NL.IMRO.0983.BP201816MANRESA-VA01',
          title: 'Nieuw Manresa',
          subtitle: 'Gemeente Venlo',
          loadingStatus: LoadingState.RESOLVED,
        })
      );
    });
  });

  describe('DocumentElementLinkEffects, showDocumentElementLinkResult for Ozon documents', () => {
    it('should trigger showDocumentElementLinkResult for Ozon documents', () => {
      actions$ = of(
        FromDocumentElementLinkActions.loadOzonLinkTekst({
          documentId: 'testOzon',
          elementId: 'elemtId',
        })
      );

      spectator.service.getOzonLinkTekst$.subscribe(fromAction => {
        expect(fromAction).toEqual(
          FromDocumentElementLinkActions.showDocumentElementLinkResult({
            element: undefined,
            documentId: 'testOzon',
            title: 'testCiteerTitel',
            subtitle: '',
            loadingStatus: LoadingState.RESOLVED,
          })
        );
      });
    });
  });
});
