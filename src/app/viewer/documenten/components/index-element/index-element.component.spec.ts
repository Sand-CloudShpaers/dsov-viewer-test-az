import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IndexElementComponent } from './index-element.component';
import { documentBodyElementOzonMock } from '~viewer/documenten/mocks/document-body-element';

describe('IndexElementComponent', () => {
  let spectator: Spectator<IndexElementComponent>;
  const spyOnCollapseSelectedElementTree = jasmine.createSpy('spyOnCollapseSelectedElementTree');

  const createComponent = createComponentFactory({
    component: IndexElementComponent,
    imports: [RouterTestingModule],
    providers: [
      mockProvider(DocumentenFacade, {
        collapseSelectedElementTree: spyOnCollapseSelectedElementTree,
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        documentId: 'xyz',
        element: documentBodyElementOzonMock,
        routerLink: '../',
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('trackBy', () => {
    it('should return string', () => {
      spectator.component.trackBy(0, documentBodyElementOzonMock);

      expect(spectator.component.trackBy(0, documentBodyElementOzonMock)).toEqual(documentBodyElementOzonMock.id);
    });
  });

  describe('clickElement', () => {
    it('should call collapseSelectedElementTree', () => {
      spectator.component.clickElement(documentBodyElementOzonMock);

      expect(spyOnCollapseSelectedElementTree).toHaveBeenCalledWith(
        'xyz',
        documentBodyElementOzonMock.id,
        documentBodyElementOzonMock.breadcrumbs
      );
    });
  });

  describe('filterChildElements', () => {
    it('should return only elements with title', () => {
      expect(
        spectator.component.filterChildElements({
          ...documentBodyElementOzonMock,
          elementen: [
            documentBodyElementOzonMock,
            {
              ...documentBodyElementOzonMock,
              layout: {
                ...documentBodyElementOzonMock.layout,
                showTitle: false,
              },
            },
          ],
        })
      ).toEqual([documentBodyElementOzonMock]);
    });
  });
});
