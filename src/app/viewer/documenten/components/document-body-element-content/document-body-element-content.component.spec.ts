import { DocumentBodyElementContentComponent } from '~viewer/documenten/components/document-body-element-content/document-body-element-content.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PipesModule } from '~general/pipes/pipes.module';
import { ApiSource } from '~model/internal/api-source';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LinkHandlerDirective } from '~general/directives/link-handler/link-handler.directive';
import { MockDirective } from 'ng-mocks';

describe('DocumentBodyElementContentComponent', () => {
  let spectator: Spectator<DocumentBodyElementContentComponent>;

  const createComponent = createComponentFactory({
    component: DocumentBodyElementContentComponent,
    declarations: [MockDirective(LinkHandlerDirective)],
    imports: [PipesModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        element: {
          id: 'test',
          documentId: 'documentId',
          apiSource: ApiSource.OZON,
          niveau: 2,
          inhoud: '<xml>test</xml>',
          hasChildren: false,
          elementen: [],
          breadcrumbs: [],
          nummer: '1.2.3',
          isOntwerp: false,
          isGereserveerd: false,
          isVervallen: false,
          layout: {
            documentViewContext: DocumentViewContext.REGELS_OP_MAAT,
            isCollapsible: false,
            isFiltered: true,
            isOpen: true,
            showElementen: false,
            showContent: true,
            showTitle: false,
            showToggle: true,
            showNumberOnly: true,
            showAnnotation: false,
            hasAnnotation: true,
            isEmptyParagraph: false,
            showBreadcrumbs: false,
          },
        },
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should toggle faded', () => {
    spectator.component.toggleFaded();

    expect(spectator.component.faded).toBeFalse();
  });

  it('html should contain number 1.2.3 and have the right css class', () => {
    expect(spectator.query('[data-test-id="document-element-inhoud-nummer"]').innerHTML).toEqual('1.2.3');

    expect(spectator.query('[data-test-id="document-element-inhoud-nummer"]')).toHaveClass('document-element__nummer');

    spectator.component.element.layout.isFiltered = false;
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="document-element-inhoud-nummer"]')).toHaveClass(
      'document-element__nummer-dimmed'
    );
  });

  it('html should contain content with the right css classes and the right button tekst', () => {
    spectator.component.element.layout.isFiltered = true;
    spectator.detectComponentChanges();

    // @ts-ignore (dso-ozon-content heeft wel content)
    expect(spectator.query('[data-test-id="document-element-inhoud-tekst"]').content).toEqual('<xml>test</xml>');

    expect(spectator.query('[data-test-id="document-element-inhoud-tekst"]')).toHaveClass(
      'document-element__inhoud-text'
    );
    spectator.component.element.layout.isFiltered = false;
    spectator.component.faded = true;
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="document-element-inhoud-tekst"]')).toHaveClass(
      'document-element__inhoud-faded'
    );

    expect(spectator.query('[data-test-id="document-element-inhoud-button-show"]').innerHTML.trim()).toEqual(
      '... aansluitende tekst lezen'
    );

    spectator.component.faded = false;
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="document-element-inhoud-tekst"]')).toHaveClass(
      'document-element__inhoud-dimmed'
    );

    expect(spectator.query('[data-test-id="document-element-inhoud-button-hide"] span').innerHTML.trim()).toEqual(
      'aansluitende tekst verbergen'
    );
  });

  it('html should contain element-options', () => {
    expect(spectator.query('[data-test-id="document-element-options-inhoud"]')).toExist();
  });

  describe('handleAnchorClick', () => {
    beforeEach(() => {
      spyOn(spectator.component.handleAnchor, 'emit');
    });

    it('should emit handleAnchor', () => {
      const event = { detail: { documentComponent: '#abc' } } as CustomEvent;
      spectator.component.handleAnchorClick(event);

      expect(spectator.component.handleAnchor.emit).toHaveBeenCalledWith(event);
    });
  });
});
