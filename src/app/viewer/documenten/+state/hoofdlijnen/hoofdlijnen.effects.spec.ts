import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';
import { HoofdlijnenEffects } from '~viewer/documenten/+state/hoofdlijnen/hoofdlijnen.effects';
import {
  mockHoofdlijnenResponse,
  mockOntwerpHoofdlijnenResponse,
} from '~viewer/documenten/+state/hoofdlijnen/hoofdlijnen.mock';
import * as HoofdlijnenActions from './hoofdlijnen.actions';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { createRegelingMock } from '~mocks/documenten.mock';
import { documentDtoMock } from '~viewer/documenten/types/documentDto.mock';

describe('HoofdlijnenEffects', () => {
  let spectator: SpectatorService<HoofdlijnenEffects>;
  let actions$: Observable<Action>;
  let omgevingsDocumentService: SpyObject<OmgevingsDocumentService>;
  const ozonDocumentMock = createRegelingMock({ identificatie: documentDtoMock.documentId });
  const localIntialState = {
    ...initialState,
    documenten: {
      documenten: {
        entities: {
          [documentDtoMock.documentId]: {
            data: {
              ihr: undefined,
              ozon: ozonDocumentMock,
            },
            entityId: documentDtoMock.documentId,
            error: undefined,
            status: 'RESOLVED',
          },
        },
        ids: [documentDtoMock.documentId],
        selectedDocument: documentDtoMock,
      },
    },
  } as any;

  const createService = createServiceFactory({
    service: HoofdlijnenEffects,
    providers: [provideMockActions(() => actions$), provideMockStore({ initialState: localIntialState })],
    mocks: [OmgevingsDocumentService],
  });

  beforeEach(() => {
    spectator = createService();
    omgevingsDocumentService = spectator.inject(OmgevingsDocumentService);
  });

  describe('loadDocumentHoofdlijnen$', () => {
    it('should loadHoofdlijnen', done => {
      actions$ = of(HoofdlijnenActions.loadHoofdlijnen({ document: documentDtoMock }));
      spectator.service.loadDocumentHoofdlijnen$.subscribe(action => {
        expect(action).toEqual(
          HoofdlijnenActions.loadingHoofdlijnen({
            document: documentDtoMock,
          })
        );
        done();
      });
    });
  });

  describe('loadingDocumentHoofdlijnen$', () => {
    it('should handle successfull api response', done => {
      omgevingsDocumentService.getDocumentHoofdlijnen$.and.returnValue(of(mockHoofdlijnenResponse));
      omgevingsDocumentService.getOntwerpDocumentHoofdlijnen$.and.returnValue(of(mockOntwerpHoofdlijnenResponse));
      actions$ = of(
        HoofdlijnenActions.loadingHoofdlijnen({
          document: { documentId: 'akn_nl_bill' },
        })
      );

      spectator.service.loadingDocumentHoofdlijnen$.subscribe(actual => {
        const expected = HoofdlijnenActions.loadHoofdlijnenSuccess({
          documentId: 'akn_nl_bill',
          vastgesteld: mockHoofdlijnenResponse,
          ontwerp: mockOntwerpHoofdlijnenResponse,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle failed api response', done => {
      const error = new Error('stuk');
      omgevingsDocumentService.getDocumentHoofdlijnen$.and.returnValue(throwError(() => error));
      actions$ = of(
        HoofdlijnenActions.loadingHoofdlijnen({
          document: documentDtoMock,
        })
      );

      spectator.service.loadingDocumentHoofdlijnen$.subscribe(actual => {
        const expected = HoofdlijnenActions.loadHoofdlijnenFailure({ documentId: '/akn/nl/act/documentId', error });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });
});
