import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { DocumentBodyElementTitleComponent } from '~viewer/documenten/components/document-body-element-title/document-body-element-title.component';
import { ApiSource } from '~model/internal/api-source';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { DocumentBodyElement } from '~viewer/documenten/types/documenten.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const documentBodyElementMock: DocumentBodyElement = {
  id: 'test',
  documentId: 'documentId',
  apiSource: ApiSource.OZON,
  niveau: 2,
  inhoud: '<Inhoud>test</Inhoud>',
  hasChildren: false,
  elementen: [],
  breadcrumbs: [
    {
      id: 'broodkruimel',
      titel: 'Broodkruimel',
    },
  ],
  nummer: '1.2.3',
  isOntwerp: false,
  isGereserveerd: false,
  isVervallen: false,
  layout: {
    documentViewContext: DocumentViewContext.REGELS_OP_MAAT,
    isFiltered: true,
    isCollapsible: false,
    isOpen: true,
    showElementen: false,
    showContent: true,
    showTitle: false,
    showToggle: true,
    showNumberOnly: true,
    showAnnotation: false,
    hasAnnotation: true,
    isEmptyParagraph: false,
    showBreadcrumbs: true,
  },
};

describe('DocumentBodyElementTitleComponent', () => {
  let spectator: Spectator<DocumentBodyElementTitleComponent>;
  const createComponent = createComponentFactory({
    component: DocumentBodyElementTitleComponent,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        documentBodyElement: documentBodyElementMock,
        viewContext: DocumentViewContext.REGELS_OP_MAAT,
      },
    });
  });

  it('should emit clickedToggle after Toggle', () => {
    spyOn(spectator.component.clickedToggle, 'emit');
    spectator.component.toggle();

    expect(spectator.component.clickedToggle.emit).toHaveBeenCalled();
  });

  it('should show breadcrumbs', () => {
    expect(spectator.query('[data-test-id="document-element-breadcrumb"]')).toExist();
  });

  it('should show title', () => {
    expect(spectator.query('[data-test-id="document-element-title"]')).toExist();
  });

  it('html should contain element-options when active', () => {
    spectator.component.documentBodyElement.layout.isActive = true;
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="document-element-title-options"]')).toExist();
  });

  it('html should not contain element-options when inactive', () => {
    spectator.component.documentBodyElement.layout.isActive = false;
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="document-element-title-options"]')).not.toExist();
  });

  it('html should show empty paragraph', () => {
    spectator.component.documentBodyElement = {
      ...documentBodyElementMock,
      layout: {
        ...documentBodyElementMock.layout,
        isEmptyParagraph: true,
      },
    };
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="document-element-title-empty-paragraph"]')).toExist();
  });
});
