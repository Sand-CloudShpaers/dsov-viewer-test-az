import { getGebiedsaanwijzingenVMArray } from '~viewer/gebiedsaanwijzingen/helpers/gebiedsaanwijzingen';
import { GebiedsaanwijzingenEmbedded } from '~ozon-model/gebiedsaanwijzingenEmbedded';
import { GebiedsaanwijzingenVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';
import { selectionMock } from '~store/common/selection/+state/selection-mock';

describe('gebiedsaanwijzingen', () => {
  describe('getGebiedsaanwijzingenVMArray', () => {
    /* Andere paden worden getest via gebiedsaanwijzingen.selectors.spec en annotaties.selectors.spec */
    it('should not push an empty gebieden array', () => {
      expect(getGebiedsaanwijzingenVMArray([], { gebiedsaanwijzingen: [] }, { ontwerpGebiedsaanwijzing: [] })).toEqual(
        []
      );
    });

    it('should return gebiedsaanwijzingen gegroepeerd per type', () => {
      expect(
        getGebiedsaanwijzingenVMArray(
          [{ ...selectionMock, id: 'nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeHR' }],
          test,
          { ontwerpGebiedsaanwijzing: [] }
        )
      ).toEqual(assert);
    });
  });
});

const test: GebiedsaanwijzingenEmbedded = {
  gebiedsaanwijzingen: [
    {
      _links: {
        self: {
          href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v7/gebiedsaanwijzingen/nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeHR?geldigOp=2022-04-06&inWerkingOp=2022-04-06&beschikbaarOp=2022-04-06T10:44Z',
        },
        beschrevenIn: {
          href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v7/regelteksten?gebiedsaanwijzingIdentificatie=nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeHR&geldigOp=2022-04-06&inWerkingOp=2022-04-06&beschikbaarOp=2022-04-06T10:44Z',
        },

        wijstAan: {
          href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v7/locaties?gebiedsaanwijzingIdentificatie=nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeHR&geldigOp=2022-04-06&inWerkingOp=2022-04-06&beschikbaarOp=2022-04-06T10:44Z',
        },
      },
      identificatie: 'nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeHR',
      geregistreerdMet: {
        versie: 1,
        beginInwerking: '2021-10-02',
        beginGeldigheid: '2021-10-02',
        tijdstipRegistratie: '2022-04-03T13:23:25.563121',
      },
      gebiedsaanwijzingType: 'http://standaarden.omgevingswet.overheid.nl/typegebiedsaanwijzing/id/concept/Natuur',
      label: 'Natuurgebiedsaanwijzingen',
      naam: 'Habitatrichtlijngebied Waddenzee',
      groep: {
        code: 'http://standaarden.omgevingswet.overheid.nl/natuur/id/concept/Habitatrichtlijngebied',
        waarde: 'habitatrichtlijngebied',
      },
    },
    {
      _links: {
        self: {
          href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v7/gebiedsaanwijzingen/nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeVR?geldigOp=2022-04-06&inWerkingOp=2022-04-06&beschikbaarOp=2022-04-06T10:44Z',
        },
        beschrevenIn: {
          href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v7/regelteksten?gebiedsaanwijzingIdentificatie=nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeVR&geldigOp=2022-04-06&inWerkingOp=2022-04-06&beschikbaarOp=2022-04-06T10:44Z',
        },

        wijstAan: {
          href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v7/locaties?gebiedsaanwijzingIdentificatie=nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeVR&geldigOp=2022-04-06&inWerkingOp=2022-04-06&beschikbaarOp=2022-04-06T10:44Z',
        },
      },
      identificatie: 'nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeVR',
      geregistreerdMet: {
        versie: 1,
        beginInwerking: '2021-10-02',
        beginGeldigheid: '2021-10-02',
        tijdstipRegistratie: '2022-04-03T13:23:25.563121',
      },
      gebiedsaanwijzingType: 'http://standaarden.omgevingswet.overheid.nl/typegebiedsaanwijzing/id/concept/Natuur',
      label: 'Natuurgebiedsaanwijzingen',
      naam: 'Vogelrichtlijngebied Waddenzee',
      groep: {
        code: 'http://standaarden.omgevingswet.overheid.nl/natuur/id/concept/Vogelrichtlijngebied',
        waarde: 'vogelrichtlijngebied',
      },
    },
    {
      _links: {
        self: {
          href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v7/gebiedsaanwijzingen/nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeN2000?geldigOp=2022-04-06&inWerkingOp=2022-04-06&beschikbaarOp=2022-04-06T10:44Z',
        },
        beschrevenIn: {
          href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v7/regelteksten?gebiedsaanwijzingIdentificatie=nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeN2000&geldigOp=2022-04-06&inWerkingOp=2022-04-06&beschikbaarOp=2022-04-06T10:44Z',
        },

        wijstAan: {
          href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v7/locaties?gebiedsaanwijzingIdentificatie=nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeN2000&geldigOp=2022-04-06&inWerkingOp=2022-04-06&beschikbaarOp=2022-04-06T10:44Z',
        },
      },
      identificatie: 'nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeN2000',
      geregistreerdMet: {
        versie: 1,
        beginInwerking: '2021-10-02',
        beginGeldigheid: '2021-10-02',
        tijdstipRegistratie: '2022-04-03T13:23:25.563121',
      },
      gebiedsaanwijzingType: 'http://standaarden.omgevingswet.overheid.nl/typegebiedsaanwijzing/id/concept/Natuur',
      label: 'Natuurgebiedsaanwijzingen',
      naam: 'Natura 2000 gebied Waddenzee',
      groep: {
        code: 'http://standaarden.omgevingswet.overheid.nl/natuur/id/concept/Natura2000Gebied',
        waarde: 'natura 2000-gebied',
      },
    },
  ],
};

const assert: GebiedsaanwijzingenVM[] = [
  {
    gebiedsaanwijzingType: 'http://standaarden.omgevingswet.overheid.nl/typegebiedsaanwijzing/id/concept/Natuur',
    label: 'Natuurgebiedsaanwijzingen',
    gebiedsaanwijzingen: [
      {
        identificatie: 'nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeHR',
        naam: 'Habitatrichtlijngebied Waddenzee',
        groep: 'habitatrichtlijngebied',
        symboolcode: 'vag123',
        isOntwerp: false,
        isSelected: true,
      },
      {
        identificatie: 'nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeN2000',
        naam: 'Natura 2000 gebied Waddenzee',
        groep: 'natura 2000-gebied',
        symboolcode: undefined,
        isOntwerp: false,
        isSelected: false,
      },
      {
        identificatie: 'nl.imow-mnre1153.gebiedsaanwijzing.WaddenzeeVR',
        naam: 'Vogelrichtlijngebied Waddenzee',
        groep: 'vogelrichtlijngebied',
        symboolcode: undefined,
        isOntwerp: false,
        isSelected: false,
      },
    ],
  },
];
