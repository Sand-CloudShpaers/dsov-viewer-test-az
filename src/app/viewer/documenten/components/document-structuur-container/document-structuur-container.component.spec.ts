import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { DocumentStructuurContainerComponent } from './document-structuur-container.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { derivedLoadingState } from '~general/utils/store.utils';
import { LoadingState } from '~model/loading-state.enum';
import { createDocumentStructuurVMMock } from '~mocks/documentStructuurVM.mock';

describe('DocumentStructuurContainerComponent', () => {
  let spectator: Spectator<DocumentStructuurContainerComponent>;

  const createComponent = createComponentFactory({
    component: DocumentStructuurContainerComponent,
    providers: [
      mockProvider(DocumentenFacade, {
        documentStructuurStatus$: of(derivedLoadingState(LoadingState.RESOLVED)),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        documentViewContext: DocumentViewContext.VOLLEDIG_DOCUMENT,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show "Document aan het laden"', () => {
    spectator.component.documentStructuurStatus$ = of(derivedLoadingState(LoadingState.PENDING));
    spectator.detectComponentChanges();

    expect(spectator.query('dsov-spinner')).toExist();
  });

  it('should show dsov-document-body, when context is: Volledig', () => {
    spectator.component.documentStructuurStatus$ = of(derivedLoadingState(LoadingState.RESOLVED));
    spectator.component.documentStructuurVM$ = of(createDocumentStructuurVMMock());
    spectator.detectComponentChanges();

    expect(spectator.query('dsov-document-body')).toExist();
  });

  it('should show dsov-document-body, when context is: Tijdelijk Deel', () => {
    spectator.component.documentViewContext = DocumentViewContext.TIJDELIJK_DEEL;
    spectator.component.documentStructuurStatus$ = of(derivedLoadingState(LoadingState.RESOLVED));
    spectator.component.documentStructuurVM$ = of(createDocumentStructuurVMMock());
    spectator.detectComponentChanges();

    expect(spectator.query('dsov-document-body')).toExist();
  });

  it('should show alert when document could not be found', () => {
    spectator.component.documentStructuurStatus$ = of(derivedLoadingState(LoadingState.REJECTED));
    spectator.detectComponentChanges();

    expect('.alert-danger').toHaveText('Inhoud document niet gevonden.');
  });
});
