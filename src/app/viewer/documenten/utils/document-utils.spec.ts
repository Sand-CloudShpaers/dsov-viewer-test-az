import { Plan } from '~ihr-model/plan';
import { createIhrPlanMock, createOntwerpRegelingMock } from '~mocks/documenten.mock';
import { ApiSource } from '~model/internal/api-source';
import { Regeling } from '~ozon-model/regeling';
import { TransformGeometryService } from '~services/ozon/transform-geometry.service';
import {
  encodeSlashes,
  getDocumentVM,
  getEscapedDocumentId,
  getIhrSubPages,
  getNormalizedDocumentType,
  getNormalizedDocumentTypeKey,
  isDocumentBeleid,
  isDocumentRegelgeving,
} from '~viewer/documenten/utils/document-utils';
import { DocumentSubPage, DocumentSubPages } from '../types/document-pages';
import { createInternalDocumentMock } from './internal-document.mock';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';

describe('documentUtils', () => {
  describe('getNormalizedDocumentTypeKey', () => {
    it('should remove spaces and put all in lowercase', () => {
      const result = getNormalizedDocumentTypeKey(' Dit is een Leuke Test');

      expect(result).toEqual('ditiseenleuketest');
    });
  });

  describe('getNormalizedDocumentType', () => {
    it('should return undefined when documenttype is not found', () => {
      const documentMock = createInternalDocumentMock();

      const result = getNormalizedDocumentType(documentMock.card.type);

      expect(result).toEqual(undefined);
    });

    it('should return "ministeriëleregeling" when documenttype is "Ministeriële Regeling"', () => {
      const documentMock = createInternalDocumentMock({
        card: {
          title: null,
          status: null,
          geldigVanafDate: null,
          regelStatus: null,
          dossierStatus: null,
          type: 'Ministeriële Regeling',
          beleidsmatigVerantwoordelijkeOverheid: null,
          isHistorisch: false,
          isVerwijderdOpDate: null,
        },
      });

      const result = getNormalizedDocumentType(documentMock.card.type);

      expect(result).toEqual('ministeriëleregeling');
    });

    it('should return undefined when document card is null', () => {
      const documentMock = createInternalDocumentMock({ card: null });

      const result = getNormalizedDocumentType(documentMock.id);

      expect(result).toEqual(undefined);
    });
  });

  describe('is document bestuurslaag beleid or regelgeving', () => {
    it('should be Beleid, not Regelgeving', () => {
      expect(isDocumentRegelgeving('Omgevingsvisie')).toBeFalse();
      expect(isDocumentBeleid('Omgevingsvisie')).toBeTrue();
    });

    it('should be Regelgeving, not Beleid', () => {
      expect(isDocumentBeleid('Amvb')).toBeFalse();
      expect(isDocumentRegelgeving('Amvb')).toBeTrue();
    });
  });

  describe('is escaped document id', () => {
    it('should return escaped document id, with replaced slashes en dashes with underscore', () => {
      expect(getEscapedDocumentId('/akn/nl/act/gm0297/2020/omgevingsplan-dingen')).toEqual(
        '_akn_nl_act_gm0297_2020_omgevingsplan_dingen'
      );
    });

    it('should return escaped document id, with replaced slashed with %2F', () => {
      expect(encodeSlashes('/akn/nl/act/gm0297/2020/omgevingsplan-dingen')).toEqual(
        '%2Fakn%2Fnl%2Fact%2Fgm0297%2F2020%2Fomgevingsplan-dingen'
      );
    });
  });

  describe('getDocumentVM', () => {
    const regeling: Regeling = {
      identificatie: 'blaat',
      type: { code: 'omgevingsvisie', waarde: 'omgevingsvisie' },
      aangeleverdDoorEen: {
        naam: 'Gemeente Utrecht',
        bestuurslaag: 'gemeente',
        code: '1234',
      },
      geregistreerdMet: {
        beginInwerking: '1-1-2020',
        beginGeldigheid: '1-1-2020',
        tijdstipRegistratie: '1-1-2020',
      },
      officieleTitel: 'testOfficieleTitel',
      opschrift: 'Beste geit op stal met grote oren',
      heeftRegelingsgebied: null,
      publicatieID: 'https://publicatie',
      _links: {
        self: {
          href: 'https://geit.test/blaat',
        },
        documentstructuur: {
          href: 'https://geit.test/blaat/structuur',
        },
        heeftRegelingsgebied: {
          href: 'https://geit.test/blaat/regelingsGebied',
        },
      },
    };

    const plan: Plan = {
      ...createIhrPlanMock(),
      heeftOnderdelen: [
        {
          externeReferenties: [''],
          type: 'document',
          heeftObjectgerichteTeksten: [],
        },
      ],
    };

    const subPages: DocumentSubPage[] = [
      DocumentSubPages.inhoud,
      DocumentSubPages.beleid,
      DocumentSubPages.bijlage,
      DocumentSubPages.kaarten,
    ];

    it('should return regeling view model with status', () => {
      expect(getDocumentVM(regeling)).toEqual({
        documentId: regeling.identificatie,
        isOmgevingsvergunning: false,
        identificatie: regeling.identificatie,
        type: 'omgevingsvisie',
        status: 'vastgesteld',
        geldigVanaf: new Date('1-1-2020'),
        inwerkingVanaf: new Date('1-1-2020'),
        bekendOp: new Date('1-1-2020'),
        statusDateLine: 'In werking vanaf 01-01-2020',
        bevoegdGezag: {
          bestuurslaag: Bestuurslaag.GEMEENTE,
          code: '1234',
          naam: 'Gemeente Utrecht',
        },
        title: 'omgevingsvisie Gemeente Utrecht',
        opschrift: 'Beste geit op stal met grote oren',
        publicatie: 'https://publicatie',
        apiSource: ApiSource.OZON,
        subPages: subPages,
        hasDocumentStructure: true,
        tijdelijkeDelen: undefined,
        locationHref: 'https://geit.test/blaat/regelingsGebied',
      });
    });

    it('should return ontwerpregeling view model with status', () => {
      expect(getDocumentVM(createOntwerpRegelingMock())).toEqual({
        documentId: createOntwerpRegelingMock().technischId,
        isOntwerp: true,
        ozonOntwerpbesluitId: createOntwerpRegelingMock().ontwerpbesluitIdentificatie,
        technischId: createOntwerpRegelingMock().technischId,
        isOmgevingsvergunning: false,
        identificatie: createOntwerpRegelingMock().identificatie,
        type: 'omgevingsvisie',
        status: 'ontwerp',
        ontvangenOp: new Date('1-2-2022'),
        bekendOp: new Date('2-2-2022'),
        statusDateLine: 'Bekend op 02-02-2022',
        bevoegdGezag: {
          bestuurslaag: Bestuurslaag.GEMEENTE,
          code: '',
          naam: '',
        },
        procedurestappen: [],
        title: 'testOntwerpRegelingCiteerTitel',
        opschrift: 'testOntwerpRegelingOpschrift',
        publicatie: null,
        apiSource: ApiSource.OZON,
        subPages: subPages,
        hasDocumentStructure: true,
        locationHref: 'https://geit.test/blaat/locatie',
      });
    });

    it('should return IHR document with onderdelen', () => {
      expect(getDocumentVM(plan)).toEqual({
        documentId: plan.id,
        isOmgevingsvergunning: false,
        identificatie: plan.id,
        type: 'Bestemmingsplan',
        status: 'vastgesteld',
        dossierStatus: 'geheel onherroepelijk in werking',
        geldigVanaf: new Date('01-01-2021'),
        statusDateLine: 'vastgesteld 01-01-2021 - geheel onherroepelijk in werking',
        bevoegdGezag: {
          bestuurslaag: Bestuurslaag.GEMEENTE,
          code: 'gm0983',
          naam: 'Gemeente Venlo',
        },
        title: 'Nieuw Manresa',
        isHistorisch: false,
        isVerwijderdOp: null,
        apiSource: ApiSource.IHR,
        subPages: [
          DocumentSubPages.inhoud,
          DocumentSubPages.gerelateerd,
          DocumentSubPages.kaarten,
          DocumentSubPages.kaartLocatieDetails,
        ],
        hasDocumentStructure: false,
        locationHref:
          'https://ruimte.omgevingswet.overheid.nl/ruimtelijke-plannen/api/opvragen/v3/plannen/NL.IMRO.0983.BP201816MANRESA-VA01?expand=bbox',
        extent: TransformGeometryService.transformGeometrieToOlGeometry(plan.bbox).getExtent(),
        ondergronden: plan.ondergronden,
        eindeRechtsgeldigheid: '01-01-2022',
      });
    });

    it('should return "[bestuurslaag document waarde] [bevoegd gezag naam]" when citeertitel is not present', () => {
      regeling.citeerTitel = '';

      expect(getDocumentVM(regeling).title).toEqual('omgevingsvisie Gemeente Utrecht');
      regeling.citeerTitel = undefined;

      expect(getDocumentVM(regeling).title).toEqual('omgevingsvisie Gemeente Utrecht');

      regeling.citeerTitel = null;

      expect(getDocumentVM(regeling).title).toEqual('omgevingsvisie Gemeente Utrecht');
    });

    describe('getTijdelijkRegelingType', () => {
      it('should return "voorbereidingsbesluit" for "Voorbeschermingsregels"', () => {
        expect(
          getDocumentVM({
            ...regeling,
            heeftTijdelijkDeel: [
              {
                type: { waarde: 'Voorbeschermingsregels' },
                geregistreerdMet: {},
                aangeleverdDoorEen: {},
              } as Regeling,
            ],
          }).tijdelijkeDelen[0].type
        ).toEqual('voorbereidingsbesluit');
      });

      it('should return "projectbesluit" for "Projectbesluit"', () => {
        expect(
          getDocumentVM({
            ...regeling,
            heeftTijdelijkDeel: [
              {
                type: { waarde: 'Projectbesluit' },
                geregistreerdMet: {},
                aangeleverdDoorEen: {},
              } as Regeling,
            ],
          }).tijdelijkeDelen[0].type
        ).toEqual('projectbesluit');
      });

      it('should return "reactieve interventie" for not "Voorbeschermingsregels" and not "Projectbesluit"', () => {
        expect(
          getDocumentVM({
            ...regeling,
            heeftTijdelijkDeel: [
              {
                type: { waarde: 'Andere waarde' },
                geregistreerdMet: {},
                aangeleverdDoorEen: {},
              } as Regeling,
            ],
          }).tijdelijkeDelen[0].type
        ).toEqual('reactieve interventie');
      });
    });
  });

  describe('IHR subpages', () => {
    it('get IHR subpages, when heeftOnderdelen is filled', () => {
      const planResponse: Plan = createIhrPlanMock();

      expect(getIhrSubPages(planResponse)).toEqual([
        {
          ...DocumentSubPages.regels,
          href: 'https://example.com/objectgericht',
        },
        DocumentSubPages.gerelateerd,
        DocumentSubPages.kaarten,
        DocumentSubPages.overig,
        DocumentSubPages.kaartLocatieDetails,
      ]);
    });

    it('get IHR subpages, when heeftOnderdelen is empty', () => {
      const planResponse: Plan = {
        ...createIhrPlanMock(),
        heeftOnderdelen: [
          {
            externeReferenties: [''],
            type: 'document',
            heeftObjectgerichteTeksten: [],
          },
        ],
      };

      expect(getIhrSubPages(planResponse)).toEqual([
        DocumentSubPages.inhoud,
        DocumentSubPages.gerelateerd,
        DocumentSubPages.kaarten,
        DocumentSubPages.kaartLocatieDetails,
      ]);
    });
  });
});
