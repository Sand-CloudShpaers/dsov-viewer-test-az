import * as fromPlannen from './plannen.selectors';
import { LoadingState } from '~model/loading-state.enum';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';
import { FilterName } from '~viewer/filter/types/filter-options';
import { createIhrPlanMock, createOntwerpRegelingMock, createRegelingMock } from '~mocks/documenten.mock';
import { ApiSource } from '~model/internal/api-source';
import { SelectionObjectType } from '~store/common/selection/selection.model';

describe('PlannenSelectors', () => {
  describe('LoadMoreUrl(s)', () => {
    it('should get loadMoreUrl ', () => {
      const url = fromPlannen.getLoadMoreUrl(Bestuurslaag.GEMEENTE).projector({
        plannen: {
          ihr: {
            gemeente: { loadMoreUrl: 'loadMoreGemeentelijkePlannen' },
            provincie: { loadMoreUrl: '' },
            rijk: { loadMoreUrl: '' },
          },
        },
      });

      expect(url).toEqual('loadMoreGemeentelijkePlannen');
    });

    it('should get loadMoreUrls for bestuurslaag', () => {
      const url = fromPlannen.getLoadMoreUrls(Bestuurslaag.GEMEENTE).projector('loadMoreGemeentelijkePlannen');

      expect(url).toEqual([{ bestuurslaag: Bestuurslaag.GEMEENTE, url: 'loadMoreGemeentelijkePlannen' }]);
    });

    it('should get all loadMoreUrls ', () => {
      const urls = fromPlannen
        .getLoadMoreUrls()
        .projector('loadMoreGemeentelijkePlannen', 'loadMoreProvincialePlannen', 'loadMoreRijksPlannen');

      expect(urls).toEqual([
        { bestuurslaag: Bestuurslaag.GEMEENTE, url: 'loadMoreGemeentelijkePlannen' },
        { bestuurslaag: Bestuurslaag.PROVINCIE, url: 'loadMoreProvincialePlannen' },
        { bestuurslaag: Bestuurslaag.RIJK, url: 'loadMoreRijksPlannen' },
      ]);
    });
  });

  describe('getStatus', () => {
    it('should select the correct statusses', () => {
      const status = fromPlannen.getStatus().projector(
        {
          plannen: {
            ihr: {
              gemeente: { status: LoadingState.PENDING },
              provincie: { status: LoadingState.RESOLVED },
              rijk: { status: LoadingState.PENDING },
            },
            ozon: {
              status: LoadingState.RESOLVED,
            },
            ozonOntwerp: {
              status: LoadingState.PENDING,
            },
          },
        },
        { regelsbeleid: [] }
      );

      expect(status).toEqual([
        LoadingState.PENDING,
        LoadingState.RESOLVED,
        LoadingState.PENDING,
        LoadingState.RESOLVED,
        LoadingState.PENDING,
      ]);
    });
  });

  describe('get ListItemVMs', () => {
    it('should getGemeentelijkeDocumentListItemsVM', () => {
      const gemeentelijkeDocumenten = fromPlannen.getDocumentListItemsVM(Bestuurslaag.GEMEENTE).projector(
        [createIhrPlanMock({ id: 'ihrPlanA' })],
        [
          createRegelingMock({
            identificatie: 'ozon_regeling',
            type: {
              code: 'omgevingsplan',
              waarde: 'omgevingsplan',
            },
          }),
        ],
        [
          createRegelingMock({
            identificatie: 'ozon_regeling_2',
            type: {
              code: 'omgevingsplan',
              waarde: 'omgevingsplan',
            },
          }),
        ],
        {
          [FilterName.ACTIVITEIT]: [],
          [FilterName.GEBIEDEN]: [],
          [FilterName.DOCUMENTEN]: [],
          [FilterName.THEMA]: [],
          [FilterName.DOCUMENT_TYPE]: [],
          [FilterName.REGELGEVING_TYPE]: [],
          [FilterName.REGELSBELEID]: [{ id: 'regels', name: 'regels', group: 'regelsbeleidType' }],
        }
      );

      expect(gemeentelijkeDocumenten.length).toEqual(3);
      expect(gemeentelijkeDocumenten[0].id).toEqual('ihrPlanA');
      expect(gemeentelijkeDocumenten[0].bundle[0].locatieIds).toEqual(['ihrPlanA']);
      expect(gemeentelijkeDocumenten[1].id).toEqual('ozon_regeling');
      expect(gemeentelijkeDocumenten[2].id).toEqual('ozon_regeling_2');
    });

    it('should return item, with ontwerp in bundle', () => {
      const gemeentelijkeDocumenten = fromPlannen.getDocumentListItemsVM(Bestuurslaag.GEMEENTE).projector(
        [],
        [
          createRegelingMock({
            identificatie: 'ozon_regeling',
            type: {
              code: 'omgevingsplan',
              waarde: 'omgevingsplan',
            },
          }),
        ],
        [
          createOntwerpRegelingMock({
            identificatie: 'ozon_regeling',
            type: {
              code: 'omgevingsplan',
              waarde: 'omgevingsplan',
            },
          }),
        ],
        {
          [FilterName.ACTIVITEIT]: [],
          [FilterName.GEBIEDEN]: [],
          [FilterName.DOCUMENTEN]: [],
          [FilterName.THEMA]: [],
          [FilterName.DOCUMENT_TYPE]: [],
          [FilterName.REGELGEVING_TYPE]: [],
          [FilterName.REGELSBELEID]: [{ id: 'regels', name: 'regels', group: 'regelsbeleidType' }],
        }
      );

      expect(gemeentelijkeDocumenten.length).toEqual(1);
      expect(gemeentelijkeDocumenten[0].bundle).toEqual([
        {
          id: 'ozon_regeling',
          documentDto: Object({
            documentId: 'ozon_regeling',
            documentType: 'omgevingsplan',
          }),
          name: 'Document',
          isOntwerp: undefined,
          apiSource: ApiSource.OZON,
          objectType: SelectionObjectType.REGELINGSGEBIED,
          symboolcode: 'regelingsgebied',
          locatieIds: null,
        },
        {
          id: 'testOntwerpRegeling_testOntwerpRegeling_ontwerpbesluitId',
          documentDto: Object({
            documentId: 'testOntwerpRegeling_testOntwerpRegeling_ontwerpbesluitId',
            documentType: 'omgevingsplan',
          }),
          name: 'Document',
          isOntwerp: true,
          apiSource: ApiSource.OZON,
          objectType: SelectionObjectType.REGELINGSGEBIED,
          symboolcode: 'regelingsgebied',
          locatieIds: null,
        },
      ]);
    });
  });
});
