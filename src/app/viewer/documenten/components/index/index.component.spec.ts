import { RouterTestingModule } from '@angular/router/testing';
import { IndexComponent } from './index.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { documentDtoMock } from '~viewer/documenten/types/documentDto.mock';
import { documentBodyElementOzonMock } from '~viewer/documenten/mocks/document-body-element';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';

describe('IndexComponent', () => {
  let spectator: Spectator<IndexComponent>;
  const spyOn_loadDocumentStructuurForSelectedDocument = jasmine.createSpy(
    'spyOn_loadDocumentStructuurForSelectedDocument'
  );
  const spyOn_documentStructuurStatus = jasmine.createSpy('spyOn_documentStructuurStatus');
  const spyOn_documentStructuurVM = jasmine.createSpy('spyOn_documentStructuurVM');
  const spyOn_filterTabRouterLink = jasmine.createSpy('spyOn_filterTabRouterLink$');

  const createComponent = createComponentFactory({
    component: IndexComponent,
    imports: [RouterTestingModule],
    providers: [
      mockProvider(DocumentenFacade, {
        loadDocumentStructuurForSelectedDocument: spyOn_loadDocumentStructuurForSelectedDocument,
        documentStructuurStatus$: spyOn_documentStructuurStatus,
        documentStructuurVM$: spyOn_documentStructuurVM,
        filterTabRouterLink$: spyOn_filterTabRouterLink,
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        document: documentDtoMock,
      },
    });
    spectator.component.routerLink$ = of('../');
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('OnInit', () => {
    it('should set observable', () => {
      spectator.component.ngOnInit();

      expect(spyOn_loadDocumentStructuurForSelectedDocument).toHaveBeenCalledWith(documentDtoMock.documentId, [
        DocumentSubPagePath.REGELS,
      ]);

      expect(spyOn_documentStructuurStatus).toHaveBeenCalledWith(documentDtoMock.documentId);
      expect(spyOn_documentStructuurVM).toHaveBeenCalledWith(
        documentDtoMock.documentId,
        DocumentViewContext.VOLLEDIG_DOCUMENT,
        DocumentSubPagePath.REGELS,
        false
      );

      expect(spyOn_filterTabRouterLink).toHaveBeenCalledWith(documentDtoMock.documentId);
    });
  });

  describe('trackBy', () => {
    it('should return string', () => {
      spectator.component.trackBy(0, documentBodyElementOzonMock);

      expect(spectator.component.trackBy(0, documentBodyElementOzonMock)).toEqual(documentBodyElementOzonMock.id);
    });
  });
});
