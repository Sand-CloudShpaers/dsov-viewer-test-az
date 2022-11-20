import { DocumentTekstenPlanobjectEffects } from './document-teksten-planobject-effects';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { IhrDocumentService } from '~viewer/documenten/services/ihr-document.service';
import { linksObject } from '~viewer/documenten/+state/document-element-link/document-element.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { IhrDocumentHtmlService } from '~viewer/documenten/services/ihr-document-html.service';
import * as DocumentTekstenPlanobjectActions from './document-teksten-planobject.actions';
import { LoadingState } from '~model/loading-state.enum';
import { TekstCollectie } from '~ihr-model/tekstCollectie';

export const ihrDocumentTekstCollectieResponse: TekstCollectie = {
  _embedded: {
    teksten: [
      {
        id: 'artikel',
        titel: 'artikel titel',
        inhoud: '<div>Artikel inhoud</div>',
        volgnummer: 123,
        kruimelpad: [],
        externeReferentie: null,
        _embedded: {
          children: [],
        },
        _links: linksObject,
      },
    ],
  },
  _links: linksObject,
};

describe('DocumenTekstenPlanobjectEffects', () => {
  let spectator: SpectatorService<DocumentTekstenPlanobjectEffects>;
  let actions$: Observable<Action>;
  let ihrDocumentService: SpyObject<IhrDocumentService>;

  const createService = createServiceFactory({
    service: DocumentTekstenPlanobjectEffects,
    providers: [provideMockActions(() => actions$)],
    mocks: [IhrDocumentService, IhrDocumentHtmlService],
  });

  beforeEach(() => {
    spectator = createService();
    ihrDocumentService = spectator.inject(IhrDocumentService);
  });

  it('should trigger loadIhrDocumentTeksten', () => {
    actions$ = of(
      DocumentTekstenPlanobjectActions.storeDocumentPlanobjectId({
        documentId: 'NL.IMRO.a.b.c',
        planobjectId: 'NL.IMRO.zyx',
        ihrObjectInfoType: 'Enkelbestemming',
        ihrObjectInfoLabel: 'waarde',
      })
    );
    spectator.service.loadDocumentTekstenbyPlanobjectId$.subscribe(action => {
      expect(action).toEqual(
        DocumentTekstenPlanobjectActions.loadIhrDocumentTeksten({
          documentId: 'NL.IMRO.a.b.c',
          planobjectId: 'NL.IMRO.zyx',
          ihrObjectInfoType: 'Enkelbestemming',
          ihrObjectInfoLabel: 'waarde',
        })
      );
    });
  });

  it('should set status to PENDING on loadIhrDocumentTeksten', () => {
    actions$ = of(
      DocumentTekstenPlanobjectActions.loadIhrDocumentTeksten({
        documentId: 'NL.IMRO.a.b.c',
        planobjectId: 'NL.IMRO.zyx',
        ihrObjectInfoType: 'Enkelbestemming',
        ihrObjectInfoLabel: 'waarde',
      })
    );
    spectator.service.startShowDocumentTekstenResult$.subscribe(action => {
      expect(action).toEqual(
        DocumentTekstenPlanobjectActions.showDocumentTekstenResult({
          content: '',
          title: 'Informatie over gepinde locatie',
          subtitle: 'Enkelbestemming - waarde',
          loadingStatus: LoadingState.PENDING,
        })
      );
    });
  });

  it('should trigger loadDocumentTekstenSuccess', () => {
    ihrDocumentService.getIhrDocumentTekstenByPlanobjectId$.and.returnValue(of(ihrDocumentTekstCollectieResponse));
    actions$ = of(
      DocumentTekstenPlanobjectActions.loadIhrDocumentTeksten({
        documentId: 'NL.IMRO.a.b.c',
        planobjectId: 'NL.IMRO.zyx',
        ihrObjectInfoType: 'Enkelbestemming',
        ihrObjectInfoLabel: 'waarde',
      })
    );
    spectator.service.getIhrDocumentTekstenByplanobjectId$.subscribe(action => {
      expect(action).toEqual(
        DocumentTekstenPlanobjectActions.loadDocumentTekstenSuccess({
          tekstCollectie: ihrDocumentTekstCollectieResponse,
          ihrObjectInfoType: 'Enkelbestemming',
          ihrObjectInfoLabel: 'waarde',
        })
      );
    });
  });

  it('should trigger loadDocumentTekstenFailure', () => {
    const documentTekstenError = new Error('oo noo');
    ihrDocumentService.getIhrDocumentTekstenByPlanobjectId$.and.returnValue(throwError(() => documentTekstenError));
    actions$ = of(
      DocumentTekstenPlanobjectActions.loadIhrDocumentTeksten({
        documentId: 'NL.IMRO.a.b.c',
        planobjectId: 'NL.IMRO.zyx',
        ihrObjectInfoType: 'Enkelbestemming',
        ihrObjectInfoLabel: 'waarde',
      })
    );
    spectator.service.getIhrDocumentTekstenByplanobjectId$.subscribe(action => {
      expect(action).toEqual(
        DocumentTekstenPlanobjectActions.loadDocumentTekstenFailure({
          documentId: 'NL.IMRO.a.b.c',
          planobjectId: 'NL.IMRO.zyx',
          error: documentTekstenError,
        })
      );
    });
  });

  it('should trigger ', () => {
    spyOn(IhrDocumentHtmlService, 'getHtmlFromTekstCollectie').and.returnValue(
      'Dit is content voor een Ihr' + ' TekstCollectie'
    );
    actions$ = of(
      DocumentTekstenPlanobjectActions.loadDocumentTekstenSuccess({
        tekstCollectie: ihrDocumentTekstCollectieResponse,
        ihrObjectInfoType: 'Enkelbestemming',
        ihrObjectInfoLabel: 'waarde',
      })
    );
    spectator.service.showDocumentTekstenResult$.subscribe(action => {
      expect(action).toEqual(
        DocumentTekstenPlanobjectActions.showDocumentTekstenResult({
          content: 'Dit is content voor een Ihr TekstCollectie',
          title: 'Informatie over gepinde locatie',
          subtitle: 'Enkelbestemming - waarde',
          loadingStatus: LoadingState.RESOLVED,
        })
      );
    });
  });
});
