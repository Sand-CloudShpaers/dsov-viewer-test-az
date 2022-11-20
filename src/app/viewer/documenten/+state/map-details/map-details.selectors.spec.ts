import * as fromSelectors from './map-details.selectors';
import { getSymboolCode } from './map-details.selectors';
import { cartografieSummaryCollectieMock, featuresBPMock, featuresMock } from './map-details.mock';
import { LoadingState } from '~model/loading-state.enum';
import { IMROCartografieInfoVM } from '~viewer/documenten/types/map-details';

describe('MapDetailsSelectors', () => {
  const IMROCartografieInfoVMs_VVP: IMROCartografieInfoVM[] = [
    {
      naam: 'Omgevingsvisie Gaaf Gelderland',
      nummer: 1,
      details: [
        {
          id: 'NL.IMRO.9925PRIMA201200000005392',
          naam: 'Omgevingsvisie Gaaf Gelderland',
          labels: ['Omgevingsvisie Gaaf Gelderland'],
          type: 'structuurvisiegebied',
          themas: ['other: algemeen'],
          symboolcode: 'AS027',
          externalLinks: [
            'https://ruimtelijkeplannen.nl/documents/NL.IMRO.9925.SVOmgvisieGG-vst1/pt_NL.IMRO.9925.SVOmgvisieGG-vst1.xml#NL.IMRO.PT.s40673bc3-bd5e-4c0e-8206-bf437233d167',
            'https://ruimtelijkeplannen.nl/documents/NL.IMRO.9925.SVOmgvisieGG-vst1/pt_NL.IMRO.9925.SVOmgvisieGG-vst1.xml#NL.IMRO.PT.sed0c077d-b839-4f73-b6b2-e80c2eedfd1a',
          ],
          selected: true,
          internalLinks: undefined,
        },
      ],
    },
    {
      naam: 'Themakaart Ruimtelijk beleid',
      nummer: 2,
      details: [
        {
          id: 'NL.IMRO.9925PRIMA201200000005469',
          naam: 'Grote zonneparken mogelijk',
          labels: ['Grote zonneparken mogelijk'],
          type: 'structuurvisiegebied',
          themas: ['energie'],
          symboolcode: 'S036',
          externalLinks: [
            'https://ruimtelijkeplannen.nl/documents/NL.IMRO.9925.SVOmgvisieGG-vst1/pt_NL.IMRO.9925.SVOmgvisieGG-vst1.xml#NL.IMRO.PT.s2739029f-7414-4874-8d95-a6c4ace31911',
          ],
          selected: true,
          internalLinks: undefined,
        },
        {
          id: 'NL.IMRO.9925PRIMA201200000005497',
          naam: 'Windenergie mogelijk',
          labels: ['Windenergie mogelijk'],
          type: 'structuurvisiegebied',
          themas: ['energie'],
          symboolcode: 'AS224',
          externalLinks: [
            'https://ruimtelijkeplannen.nl/documents/NL.IMRO.9925.SVOmgvisieGG-vst1/pt_NL.IMRO.9925.SVOmgvisieGG-vst1.xml#NL.IMRO.PT.scb35f82f-2797-468f-9910-d99d81214c09',
          ],
          selected: true,
          internalLinks: undefined,
        },
      ],
    },
  ];
  const IMROCartografieInfoVMs_BP: IMROCartografieInfoVM[] = [
    {
      nummer: 1,
      naam: 'Plankaart',
      details: [
        {
          categorie: 'Enkelbestemming',
          classificatie: 'wonen',
          naam: 'Wonen',
          id: 'NL.IMRO.30263f9c789143a68b352151d9aeb4bb',
          type: 'Enkelbestemming',
          symboolcode: 'enkelbestemming_wonen',
          labels: ['Wonen'],
          selected: true,
        },
        {
          categorie: 'Gebiedsaanduiding',
          classificatie: 'wetgevingzone',
          naam: 'wetgevingzone - wijzigingsgebied 1',
          id: 'NL.IMRO.40993086d3fd434a888f9b2e3a5bfde3',
          type: 'Gebiedsaanduiding',
          symboolcode: 'gebiedsaanduiding_wetgevingzone',
          labels: ['wetgevingzone - wijzigingsgebied 1'],
          selected: true,
        },
        {
          categorie: 'Gebiedsaanduiding',
          classificatie: 'overige zone',
          naam: 'overige zone - hoge archeologische verwachtingswaarde',
          id: 'NL.IMRO.35916c0aed1849c0b3d41967969294e8',
          type: 'Gebiedsaanduiding',
          symboolcode: 'gebiedsaanduiding_overige_zone',
          labels: ['overige zone - hoge archeologische verwachtingswaarde'],
          selected: true,
        },
        {
          categorie: 'Figuur',
          classificatie: undefined,
          naam: 'hartlijn leiding - hoogspanningsverbinding',
          id: 'NL.IMRO.90ef8b1eddfa4056b1571a0f28048e6c',
          type: 'Figuur',
          symboolcode: 'figuur_hartlijn_leiding',
          labels: ['hartlijn leiding - hoogspanningsverbinding'],
          selected: true,
        },
      ],
    },
  ];

  describe('selectMapDetails', () => {
    it('should return details op locatie voor VVP', () => {
      expect(
        fromSelectors.selectMapDetails.projector({
          cartografie: cartografieSummaryCollectieMock,
          features: featuresMock,
          status: LoadingState.RESOLVED,
        })
      ).toEqual(IMROCartografieInfoVMs_VVP);
    });

    it('should return details op locatie voor BP', () => {
      expect(
        fromSelectors.selectMapDetails.projector({
          cartografie: undefined,
          features: featuresBPMock,
          status: LoadingState.RESOLVED,
        })
      ).toEqual(IMROCartografieInfoVMs_BP);
    });
  });

  describe('getSymboolCode', () => {
    describe(' for layer "planobject_polygon"', () => {
      it('should base symboolcode only on categorie and classificatie', () => {
        expect(
          getSymboolCode('Gebiedsaanduiding', 'Enkelbestemming', 'classificatie', 'planobject_polygon', 'naam')
        ).toEqual('enkelbestemming_classificatie');
      });

      it('should base symboolcode only on type and classificatie', () => {
        expect(getSymboolCode('Enkelbestemming', undefined, 'classificatie', 'planobject_polygon', 'naam')).toEqual(
          'enkelbestemming_classificatie'
        );
      });

      it('should base symboolcode only on type', () => {
        expect(getSymboolCode('Enkelbestemming', undefined, undefined, 'planobject_polygon', 'naam')).toEqual(
          'enkelbestemming'
        );
      });
    });

    describe(' for layer "planobject_point"', () => {
      it('should append "_punt" to symboolcode', () => {
        expect(getSymboolCode('LetterTekenAanduiding', undefined, undefined, 'planobject_point', 'naam')).toEqual(
          'lettertekenaanduiding_punt'
        );
      });
    });

    describe(' for layer "planobject_linestring"', () => {
      describe(' without "naam"', () => {
        it('should append "_lijn" to symboolcode', () => {
          expect(getSymboolCode('Figuur', undefined, undefined, 'planobject_linestring', undefined)).toEqual(
            'figuur_lijn'
          );
        });
      });

      describe(' with "naam"', () => {
        it('should append "_hartlijn_leiding" to symboolcode', () => {
          expect(getSymboolCode('Figuur', undefined, undefined, 'planobject_linestring', 'hartlijn leiding')).toEqual(
            'figuur_hartlijn_leiding'
          );
        });

        it('should append "_as_van_de_weg" to symboolcode', () => {
          expect(getSymboolCode('Figuur', undefined, undefined, 'planobject_linestring', 'as van de weg')).toEqual(
            'figuur_as_van_de_weg'
          );
        });

        it('should append "_overig" to symboolcode', () => {
          expect(getSymboolCode('Figuur', undefined, undefined, 'planobject_linestring', 'iets anders')).toEqual(
            'figuur_overig'
          );
        });

        it('should only include type and not the classificatie for punten', () => {
          expect(
            getSymboolCode('Gebiedsaanduiding', undefined, 'wetgevingzone', 'planobject_point', 'verzonnen_naam')
          ).toEqual('gebiedsaanduiding_punt');
        });
      });
    });
  });
});
