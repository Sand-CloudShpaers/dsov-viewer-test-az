import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import * as fromSelectors from './document-structuur-ozon.selectors';
import {
  mockDocumentStructuurForRegelsOpMaat,
  mockOntwerpDocumentComponentEmbedded,
  mockOzonDocumentStructuurElementen,
  mockOzonDocumentStructuurElementen2,
  mockOzonDocumentStructuurElementenWithBijlagen,
} from '~viewer/documenten/+state/document-structuur/document-structuur-ozon.mock';
import { DocumentBodyElement, DocumentBodyElementType } from '~viewer/documenten/types/documenten.model';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { ApiSource } from '~model/internal/api-source';
import { ImopNodeType } from '~viewer/documenten/types/imop-nodetypes';

describe('DocumentStructuurOzonSelectors', () => {
  describe('getDocumentBodyElements', () => {
    it('should return empty array without structuur', () => {
      expect(
        fromSelectors
          .getDocumentBodyElements('empty-array', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
          .projector(undefined)
      ).toEqual([]);

      expect(
        fromSelectors
          .getDocumentBodyElements('empty-array', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
          .projector(null)
      ).toEqual([]);
    });

    it('should return empty array when there is no _embedded', () => {
      expect(
        fromSelectors
          .getDocumentBodyElements('_embedded', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
          .projector({})
      ).toEqual([]);

      expect(
        fromSelectors
          .getDocumentBodyElements('_embedded', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
          .projector({ data: {} })
      ).toEqual([]);

      expect(
        fromSelectors
          .getDocumentBodyElements('_embedded', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
          .projector({ data: { _embedded: {} } })
      ).toEqual([]);
    });

    it('should return empty array when there are no ozon documentComponenten', () => {
      expect(
        fromSelectors
          .getDocumentBodyElements('no-componenten', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
          .projector({ data: { _embedded: { ozon: { documentComponenten: [] } } } })
      ).toEqual([]);
    });

    it('should return empty array when "regels op maat" and no filter elements', () => {
      expect(
        fromSelectors
          .getDocumentBodyElements('no-componenten', DocumentViewContext.REGELS_OP_MAAT, null, false)
          .projector({ data: { _embedded: { ozon: { documentComponenten: [] } } } })
      ).toEqual([]);
    });

    it('should return empty array when there is no lichaam element', () => {
      expect(
        fromSelectors
          .getDocumentBodyElements('no-lichaam', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
          .projector({
            data: {
              _embedded: { documentComponenten: [{ type: DocumentBodyElementType.DIVISIE }] },
            },
          })
      ).toEqual([]);
    });

    it('should return lichaam when there are more root elements', () => {
      const result = fromSelectors
        .getDocumentBodyElements('lichaam', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
        .projector({ data: { ozon: { _embedded: mockOzonDocumentStructuurElementen } } });

      expect(result.length).toBe(4);
      expect(result[0].type).toEqual(DocumentBodyElementType.AANHEF);
      expect(result[0].titel.content).toEqual('<Opschrift>AANHEF</Opschrift>');
      expect(result[1].type).toEqual(DocumentBodyElementType.CONDITIEARTIKEL);
      expect(result[2].nummer).toEqual('0.');
      expect(result[3].type).toEqual(DocumentBodyElementType.SLUITING);
      expect(result[3].titel.content).toEqual('<Opschrift>SLUITING</Opschrift>');
    });

    it('should open element when collapse is open', () => {
      const collapse = {
        '/akn/nl/act/pv26/2019/OVPU-20191211__pv26_1__fdvs_0': { collapse: { isOpen: true, isClosed: false } },
      };
      const result = fromSelectors
        .getDocumentBodyElements('collapse-open', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
        .projector({ data: { ozon: { _embedded: mockOzonDocumentStructuurElementen } } }, collapse);

      expect(result[2].layout).toEqual({
        documentViewContext: DocumentViewContext.VOLLEDIG_DOCUMENT,
        showContent: false,
        showElementen: true,
        showToggle: true,
        showTitle: true,
        isCollapsible: true,
        isFiltered: true,
        isOpen: true,
        showNumberOnly: false,
        showAnnotation: false,
        hasAnnotation: false,
        isEmptyParagraph: false,
        isActive: true,
        showBreadcrumbs: false,
      });
    });

    it('should always open INHOUD and hide toggle', () => {
      const collapse = {
        '/akn/nl/act/pv26/2019/OVPU-20191211__pv26_1__fdvs_0__fdvs_o_1': { isOpen: false, isClosed: true },
      };
      const result = fromSelectors
        .getDocumentBodyElements('INHOUD', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
        .projector({ data: { ozon: { _embedded: mockOzonDocumentStructuurElementen } } }, collapse);

      expect(result[2].elementen[0].layout).toEqual({
        documentViewContext: DocumentViewContext.VOLLEDIG_DOCUMENT,
        showContent: false,
        showElementen: false,
        showToggle: false,
        showTitle: true,
        isCollapsible: true,
        isFiltered: true,
        isOpen: false,
        showNumberOnly: false,
        showAnnotation: false,
        hasAnnotation: true,
        isEmptyParagraph: false,
        isActive: true,
        showBreadcrumbs: false,
      });
    });

    it('should set annotationLink to Documentstructuur', () => {
      const result = fromSelectors
        .getDocumentBodyElements('parse', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
        .projector({ data: { ozon: { _embedded: mockOntwerpDocumentComponentEmbedded } } });

      expect(result[0].isOntwerp).toBeTrue();
      expect(result[0].annotationLink).toEqual('regeltekstLink');
    });

    it('should set isOntwerp to true', () => {
      const collapse = {
        '/akn/nl/act/pv26/2019/OVPU-20191211__pv26_1__fdvs_0__fdvs_o_1': { isOpen: true, isClosed: false },
      };
      const result = fromSelectors
        .getDocumentBodyElements('parse', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
        .projector({ data: { ozon: { _embedded: mockOzonDocumentStructuurElementen } } }, collapse);

      expect(result[2].elementen[0].annotationLink).toEqual(
        'https://test.org/api/presenteren/v4/regelteksten/nl.imow-mn002.regeltekst.2019120111010010/'
      );

      expect(result[2].elementen[1].annotationLink).toEqual(
        'https://test.org/api/presenteren/v4/regelteksten/nl.imow-mn002.regeltekst.2019120111010011/'
      );
    });

    it('should have one lichaam element', () => {
      const result = fromSelectors
        .getDocumentBodyElements('collapse-state', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
        .projector({ data: { ozon: { _embedded: mockOzonDocumentStructuurElementen2 } } });

      expect(result.length).toBe(1);
    });

    it('should have 4 elementen', () => {
      const result = fromSelectors
        .getDocumentBodyElements('collapse-state', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
        .projector({ data: { ozon: { _embedded: mockOzonDocumentStructuurElementen2 } } });
      const root = result[0];

      expect(root.elementen.length).toBe(4);
    });

    it('should start with niveau 2 and increment', () => {
      const result = fromSelectors
        .getDocumentBodyElements('collapse-state', DocumentViewContext.VOLLEDIG_DOCUMENT, null, false)
        .projector({ data: { ozon: { _embedded: mockOzonDocumentStructuurElementen2 } } });
      const root = result[0];

      expect(root.niveau).toBe(2);
      expect(root.elementen[0].niveau).toBe(3);
      expect(root.elementen[0].elementen[0].niveau).toBe(4);
    });

    it('should have breadcrumbs', () => {
      const result = fromSelectors
        .getDocumentBodyElements('documentID', DocumentViewContext.REGELS_OP_MAAT, null, false)
        .projector({ data: { ozon: { _embedded: mockDocumentStructuurForRegelsOpMaat } } }, undefined, [
          {
            identificatie: 'paragraafId',
            kruimelpad: ['artikelId'],
          },
        ]);

      expect(result[0].breadcrumbs).toEqual([
        {
          id: 'artikelId',
          titel: 'ARTIKEL 1 Artikel',
        },
      ]);
    });
  });

  describe('documentstructuurbijlagen', () => {
    const documentId = 'schaap';

    it('should return undefined', () => {
      expect(
        fromSelectors
          .getDocumentBodyElements(documentId, DocumentViewContext.BIJLAGE, DocumentSubPagePath.BIJLAGE, false)
          .projector(undefined)
      ).toEqual([]);
    });

    it('should return BijlagenVM list', () => {
      const result = fromSelectors
        .getDocumentBodyElements(documentId, DocumentViewContext.BIJLAGE, DocumentSubPagePath.BIJLAGE, false)
        .projector({ data: { ozon: { _embedded: mockOzonDocumentStructuurElementenWithBijlagen } } });
      const firstEl = mockOzonDocumentStructuurElementenWithBijlagen.documentComponenten[0];

      expect(result[0].layout).toEqual({
        documentViewContext: DocumentViewContext.BIJLAGE,
        showContent: true,
        showElementen: false,
        showToggle: true,
        showNumberOnly: false,
        showTitle: true,
        isCollapsible: true,
        isFiltered: true,
        isOpen: false,
        showAnnotation: false,
        hasAnnotation: false,
        isEmptyParagraph: false,
        isActive: true,
        showBreadcrumbs: false,
      });

      expect(result.length).toEqual(4);
      expect(result[0].id).toEqual(firstEl.identificatie);
      expect(result[0].inhoud).toEqual(firstEl.inhoud);
      expect(result[0].titel.content).toEqual(`${firstEl.opschrift}`);
      expect(result[0].titel.prefix).toEqual('BIJLAGE');
      expect(result[1].inhoud).toBeUndefined();
      expect(result[1].titel.prefix).toEqual('BIJLAGE');

      expect(result[1].elementen[0].type).toEqual('DIVISIETEKST');
      expect(result[1].elementen[0].hasChildren).toBeFalse();

      expect(result[2].titel.content).toEqual(
        `${mockOzonDocumentStructuurElementenWithBijlagen.documentComponenten[2].opschrift}`
      );

      expect(result[2].titel.prefix).toEqual('');
      expect(result[2].titel.suffix).toEqual(' - [gereserveerd]');

      expect(result[3].titel.prefix).toEqual('BIJLAGE [ongenummerd]');
    });
  });

  describe('getElement', () => {
    const documentId = 'schaap';

    it('should return undefined without structuur', () => {
      expect(fromSelectors.getElement(documentId, 'expressie').projector(undefined)).toEqual(undefined);
    });

    it('should return undefined with unknown expression', () => {
      expect(
        fromSelectors
          .getElement(documentId, 'onbestaandeExpressie')
          .projector({ data: { ozon: { _embedded: mockOzonDocumentStructuurElementenWithBijlagen } } })
      ).toEqual(undefined);
    });

    it('should return element by expression (ImopNodeType = IntRef)', () => {
      const result: DocumentBodyElement = {
        id: '/akn/nl/act/mn002/2019/reg0001__mn002_1-0__cmp_III',
        documentId: 'schaap',
        titel: {
          content: '<Opschrift>BIJ HOOFDSTUK 2 VAN DEZE REGELING</Opschrift>',
          prefix: 'BIJLAGE',
          suffix: '',
        },

        inhoud: '<Inhoud></Inhoud>',
        nummer: 'III',
        annotationLink: undefined,
        layout: {
          documentViewContext: 'Gedeeltelijk document' as any,
          showContent: true,
          showElementen: false,
          showToggle: false,
          showNumberOnly: false,
          showTitle: true,
          isCollapsible: true,
          isFiltered: false,
          isOpen: true,
          showAnnotation: false,
          hasAnnotation: false,
          isEmptyParagraph: false,
          isActive: false,
          showBreadcrumbs: false,
        },
        niveau: 2,
        type: DocumentBodyElementType.BIJLAGE,
        elementen: [],
        hasChildren: false,
        isOntwerp: false,
        isGereserveerd: false,
        isVervallen: false,
        apiSource: ApiSource.OZON,
        breadcrumbs: [
          {
            id: '/akn/nl/act/mn002/2019/reg0001__mn002_1-0__cmp_III',
            titel: 'BIJLAGE III BIJ HOOFDSTUK 2 VAN DEZE REGELING',
          },
        ],
      };

      expect(
        fromSelectors
          .getElement(documentId, 'Inhoud')
          .projector({ data: { ozon: { _embedded: mockOzonDocumentStructuurElementenWithBijlagen } } })
      ).toEqual(result);
    });

    it('should return element by wId (ImopNodeType = IntIoRef)', () => {
      const result: DocumentBodyElement = {
        id: 'gm0363_025a2e8f440e42689861af82f65c864a__cmp_o_1__content_o_1__list_o_1__item_o_1',
        documentId: 'schaap',
        titel: {
          content: '',
          prefix: 'BEGRIP',
          suffix: '',
        },

        inhoud:
          "<Begrip xmlns='https://standaarden.overheid.nl/stop/imop/tekst/' xmlns:DSO-PI12='https://standaarden.overheid.nl/lvbb/DSO-PI12' xmlns:data='https://standaarden.overheid.nl/stop/imop/data/' xmlns:ns10='http://www.w3.org/2001/SMIL20/Language' xmlns:ns2='https://standaarden.overheid.nl/stop/imop/consolidatie/' xmlns:ns4='https://standaarden.overheid.nl/lvbb/stop/uitlevering/' xmlns:ns5='http://www.opengis.net/se' xmlns:ns6='http://www.w3.org/1999/xlink' xmlns:ns7='http://www.opengis.net/ogc' xmlns:ns8='http://www.opengis.net/gml' xmlns:ns9='http://www.w3.org/2001/SMIL20/' eId='cmp_o_1__content_o_1__list_o_1__item_o_53' wId='gm0363_025a2e8f440e42689861af82f65c864a__cmp_o_1__content_o_1__list_o_1__item_o_1'><Term>bouwvlak</Term><Definitie><Al><ExtIoRef xmlns='' wId='gm0363_0dd3bcf363014bbeb08e7ee80f4dbb35__cmp_o_1__content_o_1__list_o_1__item_o_1__ref_o_1' href='https://identifier-eto.overheid.nl//join/id/regdata/gm0363/2022/0690cb9f55de41989e70c07bf2355270/nld@2022-07-13'>/join/id/regdata/gm0363/2022/0690cb9f55de41989e70c07bf2355270/nld@2022-07-13</ExtIoRef></Al></Definitie></Begrip>",
        nummer: undefined,
        annotationLink: undefined,
        layout: {
          documentViewContext: 'Gedeeltelijk document' as any,
          showContent: true,
          showElementen: false,
          showToggle: false,
          showNumberOnly: false,
          showTitle: true,
          isCollapsible: true,
          isFiltered: false,
          isOpen: true,
          showAnnotation: false,
          hasAnnotation: false,
          isEmptyParagraph: false,
          isActive: false,
          showBreadcrumbs: false,
        },
        niveau: 2,
        type: DocumentBodyElementType.BEGRIP,
        elementen: [],
        hasChildren: false,
        isOntwerp: false,
        isGereserveerd: false,
        isVervallen: false,
        apiSource: ApiSource.OZON,
        breadcrumbs: [
          {
            id: 'gm0363_025a2e8f440e42689861af82f65c864a__cmp_o_1__content_o_1__list_o_1__item_o_1',
            titel: 'BEGRIP',
          },
        ],
      };

      expect(
        fromSelectors
          .getElement(
            documentId,
            'gm0363_0dd3bcf363014bbeb08e7ee80f4dbb35__cmp_o_1__content_o_1__list_o_1__item_o_1__ref_o_1',
            ImopNodeType.INTIOREF
          )
          .projector({ data: { ozon: { _embedded: mockOzonDocumentStructuurElementenWithBijlagen } } })
      ).toEqual(result);
    });
  });
});
