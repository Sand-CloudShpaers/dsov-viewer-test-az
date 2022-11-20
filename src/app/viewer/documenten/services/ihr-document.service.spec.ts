import { createHttpFactory, HttpMethod, SpectatorHttp } from '@ngneat/spectator';
import { IhrDocumentService } from '~viewer/documenten/services/ihr-document.service';
import { bekendmakingenMock } from '~viewer/documenten/+state/bekendmakingen/bekendmakingen.selectors.spec';
import { ConfigService } from '~services/config.service';
import { IhrHttpClient } from '~http/ihr.http-client';
import { ErrorHandlingService } from '~services/error-handling.service';
import { GeometryFactory } from '~mocks/geometry-factory';
import { gerelateerdePlannenMock } from '~viewer/documenten/+state/gerelateerde-plannen/gerelateerde-plannen.selectors.spec';
import { createIhrPlanMock } from '~mocks/documenten.mock';

describe('IhrDocumentService', () => {
  const documentId = 'NL.IMRO.a-b-c';
  const successSpy = jasmine.createSpy('success');
  const failSpy = jasmine.createSpy('fail');
  let spectator: SpectatorHttp<IhrDocumentService>;
  const createService = createHttpFactory({
    service: IhrDocumentService,
    providers: [
      IhrHttpClient,
      ErrorHandlingService,
      {
        provide: ConfigService,
        useValue: {
          config: {
            ihr: {
              url: 'https://ihr.kadaster.nl',
              apiKey: 'een hele mooie key',
            },
          },
        },
      },
    ],
    mocks: [],
  });
  const mockResponse = {
    id: 'mockResponse',
    data: [{ key: 'mockKey', value: 'mockValue' }],
  };

  beforeEach(() => {
    spectator = createService();
  });

  describe('getIhrDocument$', () => {
    it('should send request to ihr endpoint', () => {
      spectator.service.getIhrDocument$(documentId).subscribe({ next: successSpy, error: failSpy });
      const findByIdUrl = encodeURI(`https://ihr.kadaster.nl/plannen/${documentId}?expand=bbox`);
      const ihrRequest = spectator.controller.expectOne(
        req => req.method === HttpMethod.GET && req.urlWithParams === findByIdUrl
      );
      ihrRequest.flush(mockResponse);

      expect(failSpy).not.toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith({ ...mockResponse });
    });
  });

  describe('getIhrDocumentOnderdelen$', () => {
    it('should send request to teksten endpoint', () => {
      spectator.service.getIhrDocumentOnderdelen$(documentId, null).subscribe({ next: successSpy, error: failSpy });
      const findByIdUrl = encodeURI(`https://ihr.kadaster.nl/plannen/${documentId}/teksten?niveau=1`);
      const ihrRequest = spectator.controller.expectOne(
        req => req.method === HttpMethod.GET && req.urlWithParams === findByIdUrl
      );
      ihrRequest.flush(mockResponse);

      expect(failSpy).not.toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith(mockResponse);
    });

    it('should send request to onderdeelHref endpoint', () => {
      spectator.service
        .getIhrDocumentOnderdelen$(documentId, 'https://www.example.com')
        .subscribe({ next: successSpy, error: failSpy });
      const findByIdUrl = encodeURI('https://www.example.com');
      const ihrRequest = spectator.controller.expectOne(
        req => req.method === HttpMethod.GET && req.urlWithParams === findByIdUrl
      );
      ihrRequest.flush(mockResponse);

      expect(failSpy).not.toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('getIhrDocumentElementById$', () => {
    it('should send request to teksten endpoint with elementId', () => {
      const elementId = 'NL.IMRO.z-y-x';
      spectator.service
        .getIhrDocumentElementById$(documentId, elementId)
        .subscribe({ next: successSpy, error: failSpy });
      const findByIdUrl = encodeURI(
        `https://ihr.kadaster.nl/plannen/${documentId}/teksten/${elementId}?expand=children`
      );
      const ihrRequest = spectator.controller.expectOne(
        req => req.method === HttpMethod.GET && req.urlWithParams === findByIdUrl
      );
      ihrRequest.flush(mockResponse);

      expect(failSpy).not.toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('getIhrDocumentStructuur$', () => {
    it('should send request to teksten endpoint with ouderId parameter', () => {
      const parentId = 'NL.IMRO.z-y-x';
      spectator.service.getIhrDocumentStructuur$(documentId, parentId).subscribe({ next: successSpy, error: failSpy });
      const findByIdUrl = encodeURI(`https://ihr.kadaster.nl/plannen/${documentId}/teksten?ouderId=${parentId}`);
      const ihrRequest = spectator.controller.expectOne(
        req => req.method === HttpMethod.GET && req.urlWithParams === findByIdUrl
      );
      ihrRequest.flush(mockResponse);

      expect(failSpy).not.toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('loadMoreIhrDocumentStructuur$', () => {
    it('should send request to url', () => {
      spectator.service
        .loadMoreIhrDocumentStructuur$('https://www.example.com')
        .subscribe({ next: successSpy, error: failSpy });
      const findUrl = encodeURI('https://www.example.com');
      const ihrRequest = spectator.controller.expectOne(req => req.method === HttpMethod.GET && req.url === findUrl);
      ihrRequest.flush(mockResponse);

      expect(failSpy).not.toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('getIhrDocumentTekstenByPlanobjectId$', () => {
    it('should send request to teksten endpoint with planobjectId parameter', () => {
      const planobjectId = 'NL.IMRO.zyx';
      spectator.service
        .getIhrDocumentTekstenByPlanobjectId$(documentId, planobjectId)
        .subscribe({ next: successSpy, error: failSpy });
      const findByIdUrl = encodeURI(
        `https://ihr.kadaster.nl/plannen/${documentId}/teksten?planobjectId=${planobjectId}&expand=children.children`
      );
      const ihrRequest = spectator.controller.expectOne(
        req => req.method === HttpMethod.GET && req.urlWithParams === findByIdUrl
      );
      ihrRequest.flush(mockResponse);

      expect(failSpy).not.toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('getIhrDocumentArtikelen$', () => {
    it('should send request to artikelen endpoint', () => {
      const mockGeometry = GeometryFactory.createPolygon();
      spectator.service
        .getIhrDocumentArtikelen$(documentId, mockGeometry)
        .subscribe({ next: successSpy, error: failSpy });
      const findByIdUrl = encodeURI(`https://ihr.kadaster.nl/plannen/${documentId}/artikelen/_zoek?pageSize=100`);
      const ihrRequest = spectator.controller.expectOne(
        req => req.method === HttpMethod.POST && req.urlWithParams === findByIdUrl
      );
      ihrRequest.flush(mockResponse);

      expect(failSpy).not.toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('getIHRBekendmakingen$', () => {
    it('should send request to bekendmakingen endpoint', () => {
      spectator.service.getIHRBekendmakingen$(documentId).subscribe({ next: successSpy, error: failSpy });

      const findByIdUrl = encodeURI(`https://ihr.kadaster.nl/plannen/${documentId}/bekendmakingen`);
      const ihrRequest = spectator.controller.expectOne(
        req => req.method === HttpMethod.GET && req.urlWithParams === findByIdUrl
      );

      ihrRequest.flush(bekendmakingenMock);

      expect(failSpy).not.toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith(bekendmakingenMock);
    });
  });

  describe('fetchGerelateerdePlannen$', () => {
    it('should send request to gerelateerde-plannen endpoint', () => {
      spectator.service.fetchGerelateerdePlannen$(documentId).subscribe({ next: successSpy, error: failSpy });

      const findByIdUrl = encodeURI(`https://ihr.kadaster.nl/plannen/${documentId}/gerelateerde-plannen`);
      const ihrRequest = spectator.controller.expectOne(
        req => req.method === HttpMethod.GET && req.urlWithParams === findByIdUrl
      );

      ihrRequest.flush(gerelateerdePlannenMock);

      expect(failSpy).not.toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith(gerelateerdePlannenMock);
    });
  });

  describe('fetchPlannenByDossierId$', () => {
    it('should send request to plannen endpoint with query-parameter dossier.id', () => {
      const dossierId = 'NL.IMRO.x-y-x';

      const dossierPlannnenMock = {
        _embedded: {
          plannen: [createIhrPlanMock()],
        },
        _links: { self: { href: `https://ihr.kadaster.nl/plannen?dossier.id=${dossierId}` } },
      };

      spectator.service.fetchPlannenByDossierId$(dossierId).subscribe({ next: successSpy, error: failSpy });

      const findByIdUrl = encodeURI(`https://ihr.kadaster.nl/plannen?dossier.id=${dossierId}`);
      const ihrRequest = spectator.controller.expectOne(
        req => req.method === HttpMethod.GET && req.urlWithParams === findByIdUrl
      );

      ihrRequest.flush(dossierPlannnenMock);

      expect(failSpy).not.toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith(dossierPlannnenMock);
    });
  });

  it('should NOT send request to plannen endpoint with query-parameter dossier.id with value null', done => {
    spectator.service.fetchPlannenByDossierId$(null).subscribe(result => {
      expect(result).toBeNull();
      done();
    });

    expect(failSpy).not.toHaveBeenCalled();
    expect(successSpy).not.toHaveBeenCalledWith();
  });
});
