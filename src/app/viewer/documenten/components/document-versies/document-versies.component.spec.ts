import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { RouterTestingModule } from '@angular/router/testing';
import { PipesModule } from '~general/pipes/pipes.module';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { MockComponent } from 'ng-mocks';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Bestuurslaag, DocumentVM } from '~viewer/documenten/types/documenten.model';
import { ApiSource } from '~model/internal/api-source';
import { DocumentVersiesComponent } from './document-versies.component';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';

describe('DocumentVersiesComponent', () => {
  let spectator: Spectator<DocumentVersiesComponent>;
  const spyOn_loadDocumentVersies = jasmine.createSpy('spyOn_loadDocumentVersies');
  const spyOn_setNavigationPath = jasmine.createSpy('spyOn_setNavigationPath');

  const createComponent = createComponentFactory({
    component: DocumentVersiesComponent,
    imports: [RouterTestingModule, PipesModule],
    providers: [
      mockProvider(NavigationFacade, {
        setNavigationPath: spyOn_setNavigationPath,
      }),
      mockProvider(DocumentenFacade, {
        loadDocumentVersies: spyOn_loadDocumentVersies,
      }),
    ],
    declarations: [MockComponent(DocumentVersiesComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  const document: DocumentVM = {
    documentId: '/akn/nl/act/3',
    apiSource: ApiSource.OZON,
    subPages: [],
    title: 'title',
    type: 'type',
    isOntwerp: false,
    statusDateLine: '',
    bevoegdGezag: {
      bestuurslaag: Bestuurslaag.RIJK,
      code: '0000',
      naam: 'beleidsmatigVerantwoordelijkeOverheid',
    },
  };

  beforeEach(() => {
    spectator = createComponent({ props: { document } });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show load document locatie', () => {
    spectator.component.ngOnInit();

    expect(spyOn_loadDocumentVersies).toHaveBeenCalledWith(document.documentId, false);
  });
});
