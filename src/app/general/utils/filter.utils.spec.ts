import { ApiSource } from '~model/internal/api-source';
import { FilterUtils, LOCATIE_ID_TYPE, PostBodyOzon, ZoekParameters } from './filter.utils';
import { FilterName, RegelgevingtypeFilter } from '~viewer/filter/types/filter-options';

describe('FilterUtils', () => {
  describe('getPostBodyOzonFromFilters', () => {
    it('should return a PostBodyOzon with zoekParameter for parameter: "locatie.identificatie"', () => {
      const expectedPostBodyOzon: PostBodyOzon = {
        zoekParameters: [
          {
            parameter: LOCATIE_ID_TYPE.locatieIdentificatie,
            zoekWaarden: ['l.a', 'l.b'],
          },
        ],
      };
      const ozonLocaties = ['l.a', 'l.b'];
      const options = {
        [FilterName.ACTIVITEIT]: [],
        [FilterName.REGELGEVING_TYPE]: [],
        [FilterName.DOCUMENT_TYPE]: [],
        [FilterName.THEMA]: [],
      } as any;

      expect(
        FilterUtils.getPostBodyOzonFromFilters(LOCATIE_ID_TYPE.locatieIdentificatie, ozonLocaties, options, '')
      ).toEqual(expectedPostBodyOzon);
    });

    it('should return a PostBodyOzon with zoekParameters for "locatie.identificatie" and "activiteit.identificatie"', () => {
      const expectedPostBodyOzon: PostBodyOzon = {
        zoekParameters: [
          {
            parameter: 'activiteit.identificatie',
            zoekWaarden: ['a.a', 'a.b'],
          },
          {
            parameter: LOCATIE_ID_TYPE.locatieIdentificatie,
            zoekWaarden: ['l.a', 'l.b'],
          },
        ],
      };
      const ozonLocaties = ['l.a', 'l.b'];
      const options = {
        [FilterName.ACTIVITEIT]: [{ id: 'a.a' }, { id: 'a.b' }],
        [FilterName.REGELGEVING_TYPE]: [],
        [FilterName.DOCUMENT_TYPE]: [],
        [FilterName.THEMA]: [],
      } as any;

      expect(
        FilterUtils.getPostBodyOzonFromFilters(LOCATIE_ID_TYPE.locatieIdentificatie, ozonLocaties, options, '')
      ).toEqual(expectedPostBodyOzon);
    });

    it('should return a PostBodyOzon without zoekParameters for "activiteit.identificatie"', () => {
      const expectedPostBodyOzon: PostBodyOzon = {
        zoekParameters: [
          {
            parameter: LOCATIE_ID_TYPE.locatieIdentificatie,
            zoekWaarden: ['l.a', 'l.b'],
          },
        ],
      };
      const ozonLocaties = ['l.a', 'l.b'];
      const options = {
        [FilterName.ACTIVITEIT]: [],
        [FilterName.REGELGEVING_TYPE]: [],
        [FilterName.DOCUMENT_TYPE]: [],
        [FilterName.THEMA]: [],
      } as any;

      expect(
        FilterUtils.getPostBodyOzonFromFilters(LOCATIE_ID_TYPE.locatieIdentificatie, ozonLocaties, options, '')
      ).toEqual(expectedPostBodyOzon);
    });

    it(
      'should return a PostBodyOzon with zoekParameters for "locatie.identificatie", "activiteit.identificatie" and' +
        ' "regeltekst.type"',
      () => {
        const expectedPostBodyOzon: PostBodyOzon = {
          zoekParameters: [
            {
              parameter: 'activiteit.identificatie',
              zoekWaarden: ['a.a', 'a.b'],
            },
            {
              parameter: 'regeltekst.type',
              zoekWaarden: ['r.o'],
            },
            {
              parameter: LOCATIE_ID_TYPE.locatieIdentificatie,
              zoekWaarden: ['l.a', 'l.b'],
            },
          ],
        };
        const ozonLocaties = ['l.a', 'l.b'];
        const options = {
          [FilterName.ACTIVITEIT]: [{ id: 'a.a' }, { id: 'a.b' }],
          [FilterName.REGELGEVING_TYPE]: [
            { id: 'r.a', ozonValue: 'r.o', applicableToSources: [ApiSource.OZON] },
            { id: 'r.b', applicableToSources: [] },
          ],
          [FilterName.DOCUMENT_TYPE]: [],
          [FilterName.THEMA]: [],
        } as any;

        expect(
          FilterUtils.getPostBodyOzonFromFilters(
            LOCATIE_ID_TYPE.locatieIdentificatie,
            ozonLocaties,
            options,
            '/regelingen/regels/_zoek'
          )
        ).toEqual(expectedPostBodyOzon);
      }
    );

    it('should return a PostBodyOzon with zoekParameters for "locatie.identificatie", "thema.code"', () => {
      const expectedPostBodyOzon: PostBodyOzon = {
        zoekParameters: [
          {
            parameter: 'thema.code',
            zoekWaarden: ['code'],
          },
          {
            parameter: LOCATIE_ID_TYPE.locatieIdentificatie,
            zoekWaarden: ['l.a', 'l.b'],
          },
        ],
      };
      const ozonLocaties = ['l.a', 'l.b'];
      const options = {
        [FilterName.ACTIVITEIT]: [],
        [FilterName.REGELGEVING_TYPE]: [],
        [FilterName.DOCUMENT_TYPE]: [],
        [FilterName.THEMA]: [{ id: 'code' }],
      } as any;

      expect(
        FilterUtils.getPostBodyOzonFromFilters(LOCATIE_ID_TYPE.locatieIdentificatie, ozonLocaties, options, '')
      ).toEqual(expectedPostBodyOzon);
    });

    it('should return a PostBodyOzon without "regeltekst.type" for beleid', () => {
      const expectedPostBodyOzon: PostBodyOzon = {
        zoekParameters: [
          {
            parameter: 'activiteit.identificatie',
            zoekWaarden: ['a.a', 'a.b'],
          },
          {
            parameter: 'locatie.identificatie',
            zoekWaarden: ['l.a', 'l.b'],
          },
        ],
      };
      const ozonLocaties = ['l.a', 'l.b'];
      const options = {
        [FilterName.ACTIVITEIT]: [{ id: 'a.a' }, { id: 'a.b' }],
        [FilterName.REGELGEVING_TYPE]: [
          { id: 'r.a', ozonValue: 'r.o', applicableToSources: [ApiSource.OZON] },
          { id: 'r.b', applicableToSources: [] },
        ],
        [FilterName.DOCUMENT_TYPE]: [],
        [FilterName.THEMA]: [],
      } as any;

      expect(
        FilterUtils.getPostBodyOzonFromFilters(
          LOCATIE_ID_TYPE.locatieIdentificatie,
          ozonLocaties,
          options,
          '/ontwerpregelingen/tekstdelen/_zoek'
        )
      ).toEqual(expectedPostBodyOzon);
    });

    it(
      'should return a PostBodyOzon with zoekParameters for "locatie.identificatie", "activiteit.identificatie",' +
        ' "regeltekst.bestuurslaag" and "document.type"',
      () => {
        const expectedPostBodyOzon: PostBodyOzon = {
          zoekParameters: [
            {
              parameter: 'activiteit.identificatie',
              zoekWaarden: ['a.a', 'a.b'],
            },
            {
              parameter: 'document.type',
              zoekWaarden: ['d.o', 'd.c'],
            },
            {
              parameter: 'regeltekst.type',
              zoekWaarden: ['r.o'],
            },
            {
              parameter: LOCATIE_ID_TYPE.locatieIdentificatie,
              zoekWaarden: ['l.a', 'l.b'],
            },
          ],
        };
        const ozonLocaties = ['l.a', 'l.b'];
        const options = {
          [FilterName.ACTIVITEIT]: [{ id: 'a.a' }, { id: 'a.b' }],
          [FilterName.REGELGEVING_TYPE]: [
            { id: 'r.a', ozonValue: 'r.o', applicableToSources: ['OZON'] },
            { id: 'r.b', applicableToSources: ['IHR'] },
          ],
          [FilterName.DOCUMENT_TYPE]: [
            { id: 'd.a', ozonValue: 'd.o', applicableToSources: ['OZON'] },
            { id: 'd.b', applicableToSources: ['IHR'] },
            { id: 'd.c', ozonValue: 'd.c', applicableToSources: ['IHR', 'OZON'] },
            { id: 'd.d', ozonValue: 'd.d', applicableToSources: ['IHR'] },
          ],
          [FilterName.THEMA]: [],
        } as any;

        expect(
          FilterUtils.getPostBodyOzonFromFilters(
            LOCATIE_ID_TYPE.locatieIdentificatie,
            ozonLocaties,
            options,
            '/regelingen/regels/_zoek'
          )
        ).toEqual(expectedPostBodyOzon);
      }
    );
  });

  describe('zoekParametersFromFilter', () => {
    it('zoekParametersFromFilter without url', () => {
      const input = FilterUtils.zoekParametersFromFilter(
        {
          activiteit: [{ id: 'id', name: 'name' }],
          regelgeving_type: [{ ozonValue: 'type', id: 'id', name: 'name', applicableToSources: [ApiSource.OZON] }],
          thema: [{ id: 'code', name: 'thema' }],
          document_type: null,
        },
        '/regelingen/regels/_zoek'
      );
      const output: ZoekParameters[] = [
        {
          parameter: 'activiteit.identificatie',
          zoekWaarden: ['id'],
        },
        {
          parameter: 'thema.code',
          zoekWaarden: ['code'],
        },
        {
          parameter: 'regeltekst.type',
          zoekWaarden: ['type'],
        },
      ];

      expect(input).toEqual(output);
    });

    it('zoekParametersFromFilter with regels url', () => {
      const input = FilterUtils.zoekParametersFromFilter(
        {
          activiteit: [{ id: 'id', name: 'name' }],
          regelgeving_type: [
            {
              ozonValue: 'type',
              id: 'id',
              name: 'name',
              applicableToSources: [ApiSource.OZON],
            },
            {
              ozonValue: 'voorOzon',
              id: 'instructieregelInstrument',
              name: 'name2',
              applicableToSources: [ApiSource.OZON],
              items: [{ name: 'item', id: 'instrument', selected: true }],
            },
          ] as RegelgevingtypeFilter[],
          thema: [{ id: 'code', name: 'thema' }],
          document_type: null,
        },
        'http://regelingen/regels/_zoek'
      );

      const output: ZoekParameters[] = [
        {
          parameter: 'activiteit.identificatie',
          zoekWaarden: ['id'],
        },
        {
          parameter: 'thema.code',
          zoekWaarden: ['code'],
        },
        {
          parameter: 'instructieregelInstrument',
          zoekWaarden: ['instrument'],
        },
        {
          parameter: 'regeltekst.type',
          zoekWaarden: ['type', 'voorOzon'],
        },
      ];

      expect(input).toEqual(output);
    });

    it('zoekParametersFromFilter with ontwerp regels url', () => {
      const input = FilterUtils.zoekParametersFromFilter(
        {
          activiteit: [{ id: 'id', name: 'name' }],
          regelgeving_type: [
            {
              ozonValue: 'type',
              id: 'id',
              name: 'name',
              applicableToSources: [ApiSource.OZON],
            },
            {
              ozonValue: 'voorOzon',
              id: 'instructieregelInstrument',
              name: 'name2',
              applicableToSources: [ApiSource.OZON],
              items: [{ name: 'item', id: 'instrument', selected: true }],
            },
          ] as RegelgevingtypeFilter[],
          thema: [{ id: 'code', name: 'thema' }],
          document_type: null,
        },
        'http://ontwerpregelingen/regels/_zoek'
      );

      const output: ZoekParameters[] = [
        {
          parameter: 'activiteit.identificatie',
          zoekWaarden: ['id'],
        },
        {
          parameter: 'thema.code',
          zoekWaarden: ['code'],
        },
        {
          parameter: 'instructieregelInstrument',
          zoekWaarden: ['instrument'],
        },
        {
          parameter: 'ontwerpregeltekst.type',
          zoekWaarden: ['type', 'voorOzon'],
        },
      ];

      expect(input).toEqual(output);
    });
  });

  describe('getNameForRegelgevingType', () => {
    it('should return name of regelgevingtype when no items are present', () => {
      expect(
        FilterUtils.getNameForRegelgevingType({
          id: 'x',
          name: 'x',
          ozonValue: 'x',
          applicableToSources: [],
        })
      ).toEqual('x');
    });

    it('should return "Instructieregels voor geselecteerd item" when regelgevingtype has that items selected', () => {
      expect(
        FilterUtils.getNameForRegelgevingType({
          id: 'x',
          name: 'x',
          ozonValue: 'x',
          applicableToSources: [],
          items: [{ selected: true, id: 'i', name: 'geselecteerd item' }],
        })
      ).toEqual('Instructieregels voor geselecteerd item');
    });

    it('should return "Instructieregels voor alle items" of regelgevingtype.labelAllItems when no items are present', () => {
      expect(
        FilterUtils.getNameForRegelgevingType({
          id: 'x',
          name: 'x',
          ozonValue: 'x',
          applicableToSources: [],
          items: [{ selected: false, id: 'i', name: 'i' }],
          labelAllItems: 'alle items',
        })
      ).toEqual('Instructieregels voor alle items');
    });
  });
});
