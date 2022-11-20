import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { of } from 'rxjs';
import { RegelsOpMaatDocumentContainerComponent } from './regels-op-maat-document-container.component';
import { Bestuurslaag, DocumentVM } from '~viewer/documenten/types/documenten.model';
import { ApiSource } from '~model/internal/api-source';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RegelsOpMaatDocumentContainerComponent', () => {
  let spectator: Spectator<RegelsOpMaatDocumentContainerComponent>;

  const derivedLoadingState: DerivedLoadingState = {
    isLoading: false,
    isIdle: false,
    isPending: false,
    isResolved: true,
    isRejected: false,
    isLoaded: true,
  };

  const documentVM: DocumentVM = {
    documentId: 'schaap',
    isOntwerp: false,
    identificatie: 'schaap',
    title: 'document titel',
    status: 'vastgesteld',
    type: 'Omgevingsplan',
    statusDateLine: '',
    bevoegdGezag: {
      bestuurslaag: Bestuurslaag.GEMEENTE,
      code: '0000',
      naam: 'Gemeente Zaltbommel',
    },
    isHistorisch: false,
    loadingState: derivedLoadingState,
    apiSource: ApiSource.OZON,
    subPages: [],
    hasDocumentStructure: true,
  };

  const createComponent = createComponentFactory({
    component: RegelsOpMaatDocumentContainerComponent,
    imports: [RouterTestingModule],
    providers: [mockProvider(DocumentenFacade)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.component.documentVM$ = of(documentVM);
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show alert when loading rejected', () => {
    const loadingState: DerivedLoadingState = {
      isLoading: false,
      isIdle: false,
      isPending: false,
      isResolved: false,
      isRejected: true,
      isLoaded: true,
    };
    spectator.component.documentStatus$ = of(loadingState);
    spectator.fixture.detectChanges();

    expect(spectator.query('dso-alert[status="danger"]')).toExist();
  });

  it('should show message when loading', () => {
    const loadingState: DerivedLoadingState = {
      isLoading: true,
      isIdle: false,
      isPending: true,
      isResolved: false,
      isRejected: false,
      isLoaded: false,
    };
    spectator.component.documentStatus$ = of(loadingState);
    spectator.fixture.detectChanges();

    expect(spectator.query('dsov-spinner')).toExist();
  });

  it('should show when resolved', () => {
    documentVM.loadingState = {
      isLoading: false,
      isIdle: false,
      isPending: false,
      isResolved: true,
      isRejected: false,
      isLoaded: true,
    };
    spectator.component.documentStatus$ = of(derivedLoadingState);
    spectator.component.documentVM$ = of(documentVM);
    spectator.fixture.detectChanges();
    const documentComponent = spectator.query('dsov-regels-op-maat-document');

    expect(documentComponent).toExist();
  });
});
