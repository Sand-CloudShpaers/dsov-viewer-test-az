import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { RegelsOpMaatDocumentHeaderComponent } from './regels-op-maat-document-header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { MockComponent } from 'ng-mocks';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Bestuurslaag, DocumentVM } from '~viewer/documenten/types/documenten.model';
import { ApiSource } from '~model/internal/api-source';
import { derivedLoadingState } from '~general/utils/store.utils';
import { LoadingState } from '~model/loading-state.enum';
import { PipesModule } from '~general/pipes/pipes.module';

describe('RegelsOpMaatDocumentHeaderComponent', () => {
  let spectator: Spectator<RegelsOpMaatDocumentHeaderComponent>;
  const spyOnSetNavigationPath = jasmine.createSpy('spyOnSetNavigationPath');
  const spyOnLoadDocumentLocatie = jasmine.createSpy('spyOnLoadDocumentLocatie');
  const spyOnResetSelections = jasmine.createSpy('spyOnResetSelections');

  const createComponent = createComponentFactory({
    component: RegelsOpMaatDocumentHeaderComponent,
    imports: [RouterTestingModule, PipesModule],
    providers: [
      provideMockStore({ initialState }),
      mockProvider(NavigationFacade, { setNavigationPath: spyOnSetNavigationPath }),
      mockProvider(SelectionFacade, { resetSelections: spyOnResetSelections }),
      mockProvider(DocumentenFacade, { loadDocumentLocatie: spyOnLoadDocumentLocatie }),
    ],
    declarations: [MockComponent(RegelsOpMaatDocumentHeaderComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  const document: DocumentVM = {
    documentId: '/akn/nl/act/3',
    isOntwerp: false,
    apiSource: ApiSource.OZON,
    loadingState: derivedLoadingState(LoadingState.RESOLVED),
    subPages: [],
    hasDocumentStructure: true,
    identificatie: '/akn/nl/act/3',
    title: 'title',
    opschrift: 'opschrift',
    status: 'vastgesteld',
    statusDateLine: '',
    type: 'type',
    bevoegdGezag: {
      bestuurslaag: Bestuurslaag.RIJK,
      code: '0000',
      naam: 'beleidsmatigVerantwoordelijkeOverheid',
    },
    inwerkingVanaf: new Date('1-1-2020'),
    geldigVanaf: new Date('1-1-2020'),
    isHistorisch: false,
    locationHref: 'href',
    extent: undefined,
  };

  const input = { document };

  beforeEach(() => {
    spectator = createComponent({ props: input });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should load document location', () => {
    spectator.component.ngOnInit();

    expect(spyOnLoadDocumentLocatie).toHaveBeenCalledWith(document.documentId, document.locationHref);
    expect(spectator.query('[data-test-id="summary__full-document-link"]')).toExist();
  });

  it('should show zoom to plan with a geometry', () => {
    spectator.setInput({
      ...input,
      document: {
        ...input.document,
        extent: [0, 0, 0, 0],
      },
    });
    spectator.detectComponentChanges();

    expect(spectator.query('dsov-zoom-to-plan')).toExist();
  });
});
