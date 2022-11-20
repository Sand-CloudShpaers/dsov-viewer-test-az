import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentElementBreadcrumbComponent } from './document-element-breadcrumb.component';
import { RegelsOpMaatFacade } from '~viewer/regels-op-maat/+state/regels-op-maat.facade';
import { Breadcrumb } from '~viewer/documenten/types/documenten.model';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('DocumentElementBreadcrumbComponent', () => {
  let spectator: Spectator<DocumentElementBreadcrumbComponent>;
  const spyOncollapseSelectedElementTree = jasmine.createSpy('spyOncollapseSelectedElementTree');

  const documentId = 'xyz';
  const elementId = 'elementId';
  const breadcrumbsMock: Breadcrumb[] = [
    {
      id: 'hoofdstukId',
      titel: 'HOOFDSTUK 1 Titel',
    },
    {
      id: 'paragraafId',
      titel: 'Paragraaf 1 Titel',
    },
    {
      id: elementId,
      titel: 'ARTIKEL 1.1 Titel',
    },
  ];

  const createComponent = createComponentFactory({
    component: DocumentElementBreadcrumbComponent,
    imports: [RouterTestingModule],
    providers: [
      mockProvider(RegelsOpMaatFacade),
      mockProvider(NavigationFacade),
      mockProvider(DocumentenFacade, {
        collapseSelectedElementTree: spyOncollapseSelectedElementTree,
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        breadcrumbs: breadcrumbsMock,
        elementId,
        documentId,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should create breadcrumbs', () => {
    spectator.component.ngOnInit();

    expect(spectator.query('[data-test-id="breadcrumbs-button__expand"]').innerHTML).toContainText('Paragraaf 1 Titel');
  });

  it('should not show breadcrumb of element', () => {
    spectator.component.ngOnInit();

    expect(spectator.query('[data-test-id="breadcrumbs-button__expand"]').innerHTML).not.toContainText(
      'ARTIKEL 1.1 Titel'
    );
  });

  it('should expand the dropdown', () => {
    spectator.component.toggle();

    expect(spectator.component.expand).toBeTrue();
  });

  it('should collapse elements, set selected element and navigate to full document', () => {
    spectator.component.select(breadcrumbsMock[1]);

    expect(spyOncollapseSelectedElementTree).toHaveBeenCalledWith(documentId, breadcrumbsMock[1].id, breadcrumbsMock);
  });

  it('should trackby', () => {
    expect(spectator.component.trackByFn(0, breadcrumbsMock[0])).toBe(breadcrumbsMock[0].id);
  });
});
