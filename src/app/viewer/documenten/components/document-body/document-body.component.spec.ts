import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentBodyComponent } from './document-body.component';
import { DocumentStructuurVM } from '~viewer/documenten/types/documenten.model';
import { ApiSource } from '~model/internal/api-source';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';

describe('DocumentBodyComponent', () => {
  let spectator: Spectator<DocumentBodyComponent>;

  const documentStructuurVMMock: DocumentStructuurVM = {
    elementen: [
      {
        id: 'id',
        documentId: 'documentId',
        layout: null,
        hasChildren: false,
        apiSource: ApiSource.OZON,
        breadcrumbs: [],
        niveau: 0,
        isOntwerp: false,
        isGereserveerd: false,
        isVervallen: false,
      },
    ],
  };

  const createComponent = createComponentFactory({
    component: DocumentBodyComponent,
    mocks: [],
    providers: [mockProvider(DocumentenFacade)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        documentId: 'schaap',
        documentViewContext: DocumentViewContext.VOLLEDIG_DOCUMENT,
        documentStructuurVM: documentStructuurVMMock,
      },
    });
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show dsov-document-body-element when showElementen is resolved', () => {
    spectator.fixture.detectChanges();

    expect(spectator.queryAll('dsov-document-body-element')).toHaveLength(1);
  });
});
