import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createServiceFactory, mockProvider, SpectatorService, SpyObject } from '@ngneat/spectator';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { createIhrPlanMock } from '~mocks/documenten.mock';
import { DocumentSubpagesGuard } from './document-subpages.guard';
import { IhrDocumentService } from '~viewer/documenten/services/ihr-document.service';
import { of } from 'rxjs';

describe('DocumentSubpagesGuard', () => {
  let ihrDocumentService: SpyObject<IhrDocumentService>;

  let spectator: SpectatorService<DocumentSubpagesGuard>;
  const createService = createServiceFactory({
    service: DocumentSubpagesGuard,
    imports: [RouterTestingModule],
    providers: [mockProvider(IhrDocumentService)],
  });

  beforeEach(() => {
    spectator = createService();
    ihrDocumentService = spectator.inject(IhrDocumentService);
  });

  describe('canActivate', () => {
    it('with IHR document', () => {
      const id = 'NL.IMRO';
      const someQueryParam = 'someQueryParam';

      const router = TestBed.inject(Router);
      const createUrlTree = spyOn(router, 'createUrlTree').and.stub();

      ihrDocumentService.getIhrDocument$.and.returnValue(of(createIhrPlanMock()));

      spectator.service.canActivate({ params: { id }, queryParams: { someQueryParam } } as any).subscribe(() => {
        expect(createUrlTree).toHaveBeenCalledWith([ApplicationPage.VIEWER, ViewerPage.DOCUMENT, id, 'regels'], {
          queryParams: { someQueryParam },
        });
      });
    });

    it('with OZON document', () => {
      const id = 'akn_nl_';
      const someQueryParam = 'someQueryParam';

      const router = TestBed.inject(Router);
      const createUrlTree = spyOn(router, 'createUrlTree').and.stub();

      spectator.service.canActivate({ params: { id }, queryParams: { someQueryParam } } as any).subscribe(() => {
        expect(createUrlTree).toHaveBeenCalledWith([ApplicationPage.VIEWER, ViewerPage.DOCUMENT, id, 'inhoud'], {
          queryParams: { someQueryParam },
        });
      });
    });

    it('loaded', () => {
      const id = 'NL.IMRO';
      const someQueryParam = 'someQueryParam';

      spectator.service.documentId = id;
      spectator.service.tree = undefined;

      spectator.service.canActivate({ params: { id }, queryParams: { someQueryParam } } as any).subscribe(response => {
        expect(response).toBe(undefined);
      });
    });
  });
});
