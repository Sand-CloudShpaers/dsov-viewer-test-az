import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { RegelsOpMaatDocumentComponent } from './regels-op-maat-document.component';
import { Bestuurslaag, DocumentVM } from '~viewer/documenten/types/documenten.model';
import { MockComponent } from 'ng-mocks';
import { ApiSource } from '~model/internal/api-source';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { createDocumentStructuurVMMock } from '~mocks/documentStructuurVM.mock';
import { of } from 'rxjs';
import { RegelsOpMaatFacade } from '~viewer/regels-op-maat/+state/regels-op-maat.facade';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { derivedLoadingState } from '~general/utils/store.utils';
import { LoadingState } from '~model/loading-state.enum';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';

describe('RegelsOpMaatDocumentComponent', () => {
  let spectator: Spectator<RegelsOpMaatDocumentComponent>;
  const spyOnLoadMore = jasmine.createSpy('spyOnLoadMore');

  const createComponent = createComponentFactory({
    component: RegelsOpMaatDocumentComponent,
    providers: [
      provideMockStore({ initialState }),
      DocumentenFacade,
      mockProvider(RegelsOpMaatFacade, {
        loadMoreRegelsOpMaat: spyOnLoadMore,
      }),
      mockProvider(OmgevingsDocumentService),
    ],
    declarations: [MockComponent(RegelsOpMaatDocumentComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  const documentVM: DocumentVM = {
    documentId: 'schaap',
    isOntwerp: false,
    isOmgevingsvergunning: false,
    identificatie: 'schaap',
    title: 'document titel',
    status: 'vastgesteld',
    type: 'Omgevingsplan',
    statusDateLine: '',
    bevoegdGezag: {
      code: '1234',
      bestuurslaag: Bestuurslaag.GEMEENTE,
      naam: 'Gemeente Zaltbommel',
    },
    isHistorisch: false,
    loadingState: derivedLoadingState(LoadingState.RESOLVED),
    apiSource: ApiSource.OZON,
    subPages: [],
    hasDocumentStructure: true,
  };

  beforeEach(() => {
    spectator = createComponent({
      props: {
        documentVM: documentVM,
        documentId: 'schaap',
      },
    });
    spectator.component.documentStructuurVM$ = of(createDocumentStructuurVMMock());

    spectator.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show inhoud, when document has no structure', () => {
    spectator.setInput({
      documentVM: {
        ...documentVM,
        hasDocumentStructure: false,
      },
      documentId: 'schaap',
    });
    spectator.detectChanges();

    expect(spectator.query('dsov-inhoud-container')).toExist();
  });

  it('should load more', () => {
    spectator.setInput({
      documentId: 'documentId',
    });
    spectator.component.emitLoadMore();

    expect(spyOnLoadMore).toHaveBeenCalledWith({
      documentId: 'documentId',
      documentType: 'Omgevingsplan',
    });
  });
});
