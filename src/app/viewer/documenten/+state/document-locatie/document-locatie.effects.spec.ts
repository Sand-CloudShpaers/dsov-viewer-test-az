import { createServiceFactory, mockProvider, SpectatorService, SpyObject } from '@ngneat/spectator';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { documentFeatureRootKey } from '~viewer/documenten/+state';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';
import * as DocumentLocatieActions from './document-locatie.actions';
import { featureKey } from './document-locatie.reducer';
import { DocumentLocatieEffects } from './document-locatie.effects';
import { OzonProvider } from '~providers/ozon.provider';
import { LocatieMetBoundingBox } from '~ozon-model/locatieMetBoundingBox';
import { LocatieType } from '~ozon-model/locatieType';

export const mockLocatieMetBoundingBox: LocatieMetBoundingBox = {
  identificatie: 'documentId',
  locatieType: LocatieType.Gebied,
  omvat: [],
  boundingBox: {
    minx: 0,
    maxx: 0,
    miny: 0,
    maxy: 0,
  },
  geregistreerdMet: null,
};

describe('DocumentLocatieEffects', () => {
  let spectator: SpectatorService<DocumentLocatieEffects>;
  let actions$: Observable<Action>;
  let ozonProvider: SpyObject<OzonProvider>;
  const initialState = {
    [documentFeatureRootKey]: {
      [featureKey]: {
        ids: [],
        entities: {},
      },
    },
  } as any;

  const createService = createServiceFactory({
    service: DocumentLocatieEffects,
    providers: [
      provideMockStore({
        initialState,
      }),
      provideMockActions(() => actions$),
      mockProvider(OzonProvider),
    ],
    mocks: [OmgevingsDocumentService],
  });

  beforeEach(() => {
    spectator = createService();
    ozonProvider = spectator.inject(OzonProvider);
  });

  describe('load', () => {
    it('should start loading', done => {
      actions$ = of(DocumentLocatieActions.load({ href: 'href', documentId: 'documentId' }));
      spectator.service.load$.subscribe(action => {
        expect(action).toEqual(
          DocumentLocatieActions.loading({
            href: 'href',
            documentId: 'documentId',
          })
        );
        done();
      });
    });
  });

  describe('loading', () => {
    it('should fetchLocatieMetBoundingBox', done => {
      ozonProvider.fetchLocatieMetBoundingBox$.and.returnValue(of(mockLocatieMetBoundingBox));
      actions$ = of(DocumentLocatieActions.loading({ href: 'href', documentId: 'documentId' }));
      spectator.service.loading$.subscribe(action => {
        expect(action).toEqual(
          DocumentLocatieActions.loadingSuccess({
            documentId: 'documentId',
            locatie: mockLocatieMetBoundingBox,
          })
        );
        done();
      });
    });
  });
});
