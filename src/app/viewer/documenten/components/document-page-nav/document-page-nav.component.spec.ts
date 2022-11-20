import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentPageNavComponent } from '~viewer/documenten/components/document-page-nav/document-page-nav.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApiSource } from '~model/internal/api-source';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';
import { DocumentSubPages } from '~viewer/documenten/types/document-pages';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { KaartServiceMock } from '~viewer/kaart/services/kaart.service.mock';

describe('DocumentPageNavComponent', () => {
  let spectator: SpectatorRouting<DocumentPageNavComponent>;

  const createComponent = createRoutingFactory({
    component: DocumentPageNavComponent,
    imports: [RouterTestingModule],
    stubsEnabled: false,
    providers: [{ provide: KaartService, useClass: KaartServiceMock }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        documentVM: {
          documentId: '/akn/nl/act/3',
          apiSource: ApiSource.OZON,
          subPages: [DocumentSubPages.inhoud, DocumentSubPages.regels],
          title: 'title',
          type: 'type',
          isOntwerp: false,
          statusDateLine: '',
          bevoegdGezag: {
            bestuurslaag: Bestuurslaag.RIJK,
            code: '0000',
            naam: 'beleidsmatigVerantwoordelijkeOverheid',
          },
        },
      },
    });
    spectator.detectComponentChanges();

    spectator.setRouteParam('id', '1234');
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should activate first tab', () => {
    spectator.component.ngOnInit();

    expect(spectator.queryAll('li').length).toBe(2);
  });
});
