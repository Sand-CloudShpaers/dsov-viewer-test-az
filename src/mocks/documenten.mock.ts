import { merge } from 'lodash-es';
import { Plan } from '~ihr-model/plan';
import { Regeling } from '~ozon-model/regeling';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { Omgevingsvergunning } from '~ozon-model/omgevingsvergunning';
import { BestuurslaagExtern } from '~viewer/documenten/types/documenten.model';

export function createRegelingMock(data: Partial<Regeling> = {}): Regeling {
  const document: Regeling = {
    identificatie: '/akn/nl/act/test',
    type: {
      code: 'omgevingsvisie',
      waarde: 'omgevingsvisie',
    },
    geregistreerdMet: {
      beginGeldigheid: '2022-02-02',
      beginInwerking: '2022-02-02',
      eindGeldigheid: '2022-03-03',
      eindRegistratie: '2022-09-08T13:11:07.69618Z',
      tijdstipRegistratie: '2022-09-08T11:15:00.201566Z',
      versie: 1,
    },

    aangeleverdDoorEen: {
      bestuurslaag: '',
      naam: '',
      code: '',
    },
    citeerTitel: 'testCiteerTitel',
    officieleTitel: 'testOfficieleTitel',
    opschrift: 'testOpschrift',
    heeftRegelingsgebied: null,
    publicatieID: null,
    _links: {
      heeftRegelingsgebied: {
        href: 'https://geit.test/blaat/locatie',
      },
      self: {
        href: 'https://geit.test/blaat',
      },
      documentstructuur: {
        href: 'https://geit.test/blaat/structuur',
      },
      heeftBeoogdeOpvolgers: [
        {
          href: 'opvolger',
        },
      ],
    },
  };
  merge(document, data);

  return document;
}

export function createOntwerpRegelingMock(data: Partial<OntwerpRegeling> = {}): OntwerpRegeling {
  const document: OntwerpRegeling = {
    identificatie: 'testOntwerpRegeling',
    ontwerpbesluitIdentificatie: 'testOntwerpRegeling_ontwerpbesluitId',
    technischId: 'testOntwerpRegeling_testOntwerpRegeling_ontwerpbesluitId',
    type: {
      code: 'omgevingsvisie',
      waarde: 'omgevingsvisie',
    },
    aangeleverdDoorEen: {
      bestuurslaag: '',
      naam: '',
      code: '',
    },
    procedureverloop: {
      bekendOp: '2-2-2022',
      ontvangenOp: '1-2-2022',
    },
    citeerTitel: 'testOntwerpRegelingCiteerTitel',
    officieleTitel: 'testOntwerpRegelingOfficieleTitel',
    opschrift: 'testOntwerpRegelingOpschrift',
    heeftRegelingsgebied: null,
    heeftOntwerpRegelingsgebied: null,
    publicatieID: null,
    geregistreerdMet: {
      versie: null,
      tijdstipRegistratie: null,
      eindRegistratie: null,
      status: null,
    },
    _links: {
      heeftRegelingsgebied: {
        href: 'https://geit.test/blaat/locatie',
      },
      self: {
        href: 'https://geit.test/blaat',
      },
      documentstructuur: {
        href: 'https://geit.test/blaat/structuur',
      },
    },
  };
  merge(document, data);

  return document;
}

export function createOmgevingsvergunningMock(data: Partial<Omgevingsvergunning> = {}): Omgevingsvergunning {
  const document: Omgevingsvergunning = {
    identificatie: 'Omgevingsvergunning',
    type: {
      code: 'Omgevingsvergunning',
      waarde: '1',
    },
    geregistreerdMet: {
      beginInwerking: '1-1-2020',
      beginGeldigheid: '',
      tijdstipRegistratie: '',
    },
    aangeleverdDoorEen: {
      naam: 'Gemeente Rotterdam',
      bestuurslaag: 'gemeente',
      code: 'gm0599',
    },
    officieleTitel: 'Aangevraagde omgevingsvergunning Nieuwe Binnenweg 173',
    omschrijving: 'Aangevraagde omgevingsvergunning Nieuwe Binnenweg 173',
    referentienummer: 'Vergunning 1234/VG/Afw1',
    heeftVergunningsgebied: {
      identificatie: 'test-gebied',
      geregistreerdMet: {
        beginInwerking: '1-1-2020',
        beginGeldigheid: '',
        tijdstipRegistratie: '',
      },
    },
    publicatieID: 'https://identifier-eto.overheid.nl/akn/nl/officialGazette/gmb/2021/183/nld@2021-01-29-test',
    iMROPlanidentificatie: ['NL.IMRO.0599.AfwijkvergVB-Abc1'],
    _links: {
      self: {
        href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v6/omgevingsvergunningen/gm0599_Vergunning1234VGAfw1_01',
      },
      heeftVergunningsgebied: {
        href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v6/locaties/nl.imow-mnre1034.gebied.Nederland',
      },
    },
  };
  merge(document, data);

  return document;
}

export function createIhrPlanMock(data: Partial<Plan> = {}): Plan {
  const document: Plan = {
    id: 'NL.IMRO.0983.BP201816MANRESA-VA01',
    type: 'bestemmingsplan',
    isTamPlan: false,
    beleidsmatigVerantwoordelijkeOverheid: {
      code: '0983',
      naam: 'Gemeente Venlo',
      type: BestuurslaagExtern.GEMEENTELIJKE_OVERHEID,
    },
    publicerendBevoegdGezag: {
      naam: 'publicerendBevoegdGezag',
      type: 'deelgemeente/stadsdeel',
      code: '123',
    },
    beroepEnBezwaar: 'Ja',
    naam: 'Nieuw Manresa',
    locatienamen: ['Nieuw Manresa'],
    planstatusInfo: {
      planstatus: 'vastgesteld',
      datum: '01-01-2021',
    },
    verwijzingNaarVaststellingsbesluit:
      'https://www.ruimtelijkeplannen.nl/documents/NL.IMRO.0983.BP201816MANRESA-VA01/vb_NL.IMRO.0983.BP201816MANRESA-VA01.pdf',
    verwijzingNaarGml: '',
    besluitnummer: '1488721',
    verwijzingNorm: ['IMRO2012', 'IMROPT2012', 'PRABPK2012', 'PRBP2012', 'PRPT2012'],
    normadressant: [],
    ondergronden: [{ datum: '2018-11-06', type: 'basisregistratie grootschalige topografie (BGT)' }],
    relatiesMetExternePlannen: {
      gebruiktInformatieUit: [],
      gedeeltelijkeHerzieningVan: [],
      muteert: [],
      tenGevolgeVan: [],
      uitTeWerkenIn: [],
      uitgewerktIn: [],
      vervangt: [
        {
          href: 'https://ruimte.omgevingswet.overheid.nl/ruimtelijke-plannen/api/opvragen/v3/plannen/NL.IMRO.0983.BPL2009007-VA02',
          naam: 'Venlo-Oost',
          id: 'NL.IMRO.0983.BPL2009007-VA02',
          dossier: null,
          planstatusInfo: null,
        },
      ],
    },
    relatiesVanuitExternePlannen: {
      gebruiktInformatieUit: [],
      gedeeltelijkeHerzieningVan: [],
      muteert: [],
      tenGevolgeVan: [],
      uitTeWerkenIn: [],
      uitgewerktIn: [],
      vervangt: [
        {
          href: 'https://ruimte.omgevingswet.overheid.nl/ruimtelijke-plannen/api/opvragen/v3/plannen/NL.IMRO.0983.BPL2009007-VA03',
          naam: 'Venlo-Oost 3',
          id: 'NL.IMRO.0983.BPL2009007-VA03',
          dossier: null,
          planstatusInfo: null,
        },
      ],
    },
    illustraties: [
      {
        type: 'illustratie',
        href: 'https://ruimtelijkeplannen.nl/rawdocuments/NL.IMRO.0983.BP201816MANRESA-VA01/b_NL.IMRO.0983.BP201816MANRESA-VA01_rb.html',
        naam: '',
        legendanaam: '',
      },
    ],
    heeftOnderdelen: [
      {
        externeReferenties: [
          'https://ruimtelijkeplannen.nl/rawdocuments/NL.IMRO.0983.BP201816MANRESA-VA01/b_NL.IMRO.0983.BP201816MANRESA-VA01_rb.html',
        ],
        type: 'bijlage bij regels',
        heeftObjectgerichteTeksten: [],
      },
      {
        externeReferenties: [
          'https://ruimtelijkeplannen.nl/rawdocuments/NL.IMRO.0983.BP201816MANRESA-VA01/r_NL.IMRO.0983.BP201816MANRESA-VA01.html',
        ],
        type: 'regels',
        heeftObjectgerichteTeksten: [
          {
            href: 'https://example.com/objectgericht',
            titel: 'Regels',
            type: 'regels',
          },
        ],
      },
      {
        externeReferenties: [
          'https://ruimtelijkeplannen.nl/rawdocuments/NL.IMRO.0983.BP201816MANRESA-VA01/b_NL.IMRO.0983.BP201816MANRESA-VA01_tb.html',
        ],
        type: 'bijlage bij toelichting',
        heeftObjectgerichteTeksten: [],
      },
      {
        externeReferenties: [
          'https://ruimtelijkeplannen.nl/rawdocuments/NL.IMRO.0983.BP201816MANRESA-VA01/t_NL.IMRO.0983.BP201816MANRESA-VA01.html',
        ],
        type: 'toelichting',
        heeftObjectgerichteTeksten: [],
      },
    ],
    regelStatus: null,
    regelBinding: 'burgerbindend',
    dossier: {
      id: 'NL.IMRO.0983.BP201816MANRESA',
      status: 'geheel onherroepelijk in werking',
    },
    isHistorisch: false,
    verwijderdOp: null,
    eindeRechtsgeldigheid: '01-01-2022',
    bbox: { coordinates: [0, 0], type: 'Point' },
    isParapluplan: false,
    _links: {
      self: {
        href: 'https://ruimte.omgevingswet.overheid.nl/ruimtelijke-plannen/api/opvragen/v3/plannen/NL.IMRO.0983.BP201816MANRESA-VA01',
      },
    },
    geometrie: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [210701.161, 373825.646],
            [210637.18, 373765.24],
            [210641.814, 373757.135],
            [210626.216, 373746.586],
            [210599.669, 373728.624],
            [210553.054, 373697.107],
            [210560.741, 373680.313],
            [210568.741, 373662.842],
            [210576.633, 373645.622],
            [210600.589, 373593.466],
            [210657.832, 373634.615],
            [210703.529, 373667.606],
            [210868.992, 373785.485],
            [210953.925, 373845.181],
            [210920.089, 373885.529],
            [210938.199, 373898.184],
            [210906.521, 373935.97],
            [210886.276, 373922.278],
            [210849.658, 373965.845],
            [210701.161, 373825.646],
          ],
        ],
        [
          [
            [210804.247, 374686.255],
            [210807.371, 374695.323],
            [210814.221, 374717.334],
            [210821.495, 374746.095],
            [210826.534, 374769.853],
            [210827.581, 374775.99],
            [210828.247, 374780.104],
            [210813.714, 374781.715],
            [210803.875, 374782.806],
            [210794.035, 374783.897],
            [210784.195, 374784.988],
            [210769.7, 374786.595],
            [210763.52, 374789.792],
            [210754.727, 374794.34],
            [210745.934, 374798.889],
            [210737.141, 374803.437],
            [210728.347, 374807.986],
            [210724.443, 374798.491],
            [210699.286, 374792.739],
            [210692.331, 374793.247],
            [210669.952, 374790.745],
            [210660.777, 374779.173],
            [210617.99, 374687.457],
            [210617.99, 374687.457],
            [210617.954, 374687.38],
            [210617.917, 374687.302],
            [210617.88, 374687.225],
            [210617.843, 374687.148],
            [210617.805, 374687.071],
            [210617.767, 374686.995],
            [210617.729, 374686.918],
            [210617.69, 374686.842],
            [210617.651, 374686.766],
            [210617.612, 374686.69],
            [210617.572, 374686.614],
            [210617.532, 374686.538],
            [210617.492, 374686.463],
            [210617.451, 374686.388],
            [210617.411, 374686.312],
            [210617.369, 374686.238],
            [210617.328, 374686.163],
            [210617.286, 374686.088],
            [210617.244, 374686.014],
            [210617.201, 374685.94],
            [210617.158, 374685.865],
            [210617.115, 374685.792],
            [210617.072, 374685.718],
            [210617.028, 374685.644],
            [210616.984, 374685.571],
            [210616.94, 374685.498],
            [210616.895, 374685.425],
            [210616.85, 374685.352],
            [210616.805, 374685.28],
            [210616.759, 374685.207],
            [210616.713, 374685.135],
            [210616.667, 374685.063],
            [210616.62, 374684.992],
            [210616.573, 374684.92],
            [210616.526, 374684.849],
            [210616.479, 374684.778],
            [210616.431, 374684.707],
            [210616.383, 374684.636],
            [210616.334, 374684.565],
            [210616.286, 374684.495],
            [210616.237, 374684.425],
            [210616.187, 374684.355],
            [210616.138, 374684.285],
            [210616.088, 374684.216],
            [210616.038, 374684.147],
            [210615.987, 374684.077],
            [210615.937, 374684.009],
            [210615.885, 374683.94],
            [210615.834, 374683.872],
            [210615.782, 374683.803],
            [210615.731, 374683.735],
            [210615.678, 374683.668],
            [210615.626, 374683.6],
            [210615.573, 374683.533],
            [210615.52, 374683.466],
            [210615.467, 374683.399],
            [210615.413, 374683.332],
            [210615.359, 374683.266],
            [210615.305, 374683.2],
            [210615.25, 374683.134],
            [210615.195, 374683.068],
            [210615.14, 374683.003],
            [210615.085, 374682.938],
            [210615.029, 374682.873],
            [210614.973, 374682.808],
            [210614.917, 374682.743],
            [210614.861, 374682.679],
            [210614.804, 374682.615],
            [210614.747, 374682.551],
            [210614.69, 374682.488],
            [210614.632, 374682.425],
            [210614.574, 374682.362],
            [210614.516, 374682.299],
            [210614.458, 374682.236],
            [210614.399, 374682.174],
            [210614.34, 374682.112],
            [210614.281, 374682.05],
            [210614.222, 374681.989],
            [210614.162, 374681.927],
            [210614.102, 374681.866],
            [210614.042, 374681.806],
            [210613.981, 374681.745],
            [210613.921, 374681.685],
            [210613.86, 374681.625],
            [210613.799, 374681.565],
            [210613.737, 374681.506],
            [210613.675, 374681.446],
            [210613.613, 374681.387],
            [210613.551, 374681.329],
            [210613.489, 374681.27],
            [210613.426, 374681.212],
            [210613.363, 374681.154],
            [210613.3, 374681.097],
            [210613.236, 374681.04],
            [210613.172, 374680.982],
            [210613.108, 374680.926],
            [210613.044, 374680.869],
            [210612.98, 374680.813],
            [210612.915, 374680.757],
            [210612.915, 374680.757],
            [210609.64, 374677.935],
            [210609.64, 374677.935],
            [210609.597, 374677.898],
            [210609.553, 374677.86],
            [210609.51, 374677.822],
            [210609.467, 374677.785],
            [210609.424, 374677.747],
            [210609.382, 374677.709],
            [210609.339, 374677.671],
            [210609.296, 374677.632],
            [210609.254, 374677.594],
            [210609.212, 374677.555],
            [210609.169, 374677.517],
            [210609.127, 374677.478],
            [210609.085, 374677.439],
            [210609.043, 374677.4],
            [210609.002, 374677.361],
            [210608.96, 374677.322],
            [210608.918, 374677.283],
            [210608.877, 374677.243],
            [210608.836, 374677.204],
            [210608.794, 374677.164],
            [210608.753, 374677.124],
            [210608.712, 374677.084],
            [210608.671, 374677.044],
            [210608.631, 374677.004],
            [210608.59, 374676.964],
            [210608.549, 374676.923],
            [210608.509, 374676.883],
            [210608.469, 374676.842],
            [210608.429, 374676.801],
            [210608.388, 374676.76],
            [210608.349, 374676.719],
            [210608.309, 374676.678],
            [210608.269, 374676.637],
            [210608.229, 374676.596],
            [210608.19, 374676.554],
            [210608.151, 374676.513],
            [210608.111, 374676.471],
            [210608.072, 374676.429],
            [210608.033, 374676.387],
            [210607.994, 374676.345],
            [210607.956, 374676.303],
            [210607.917, 374676.261],
            [210607.878, 374676.219],
            [210607.84, 374676.176],
            [210607.802, 374676.134],
            [210607.764, 374676.091],
            [210607.726, 374676.048],
            [210607.688, 374676.005],
            [210607.65, 374675.963],
            [210607.612, 374675.919],
            [210607.575, 374675.876],
            [210607.537, 374675.833],
            [210607.5, 374675.789],
            [210607.463, 374675.746],
            [210607.426, 374675.702],
            [210607.389, 374675.659],
            [210607.352, 374675.615],
            [210607.315, 374675.571],
            [210607.279, 374675.527],
            [210607.242, 374675.483],
            [210607.206, 374675.438],
            [210607.17, 374675.394],
            [210607.134, 374675.35],
            [210607.098, 374675.305],
            [210607.062, 374675.26],
            [210607.027, 374675.216],
            [210606.991, 374675.171],
            [210606.956, 374675.126],
            [210606.92, 374675.081],
            [210606.885, 374675.035],
            [210606.85, 374674.99],
            [210606.815, 374674.945],
            [210606.781, 374674.899],
            [210606.746, 374674.854],
            [210606.712, 374674.808],
            [210606.677, 374674.762],
            [210606.643, 374674.716],
            [210606.609, 374674.67],
            [210606.575, 374674.624],
            [210606.541, 374674.578],
            [210606.507, 374674.532],
            [210606.474, 374674.486],
            [210606.44, 374674.439],
            [210606.407, 374674.392],
            [210606.374, 374674.346],
            [210606.341, 374674.299],
            [210606.308, 374674.252],
            [210606.275, 374674.205],
            [210606.243, 374674.158],
            [210606.21, 374674.111],
            [210606.178, 374674.064],
            [210606.146, 374674.017],
            [210606.114, 374673.969],
            [210606.082, 374673.922],
            [210606.05, 374673.874],
            [210606.018, 374673.827],
            [210605.987, 374673.779],
            [210605.955, 374673.731],
            [210605.924, 374673.683],
            [210605.924, 374673.683],
            [210605.124, 374672.453],
            [210602.606, 374668.137],
            [210600.206, 374663.602],
            [210599.143, 374661.284],
            [210598.248, 374658.96],
            [210597.578, 374656.649],
            [210597.179, 374654.37],
            [210597.041, 374652.131],
            [210597.138, 374649.935],
            [210597.442, 374647.787],
            [210597.928, 374645.69],
            [210598.57, 374643.654],
            [210599.356, 374641.701],
            [210600.277, 374639.859],
            [210601.322, 374638.158],
            [210602.484, 374636.624],
            [210603.756, 374635.278],
            [210605.153, 374634.108],
            [210606.692, 374633.099],
            [210608.393, 374632.232],
            [210610.271, 374631.49],
            [210612.327, 374630.864],
            [210614.501, 374630.372],
            [210616.722, 374630.037],
            [210618.919, 374629.88],
            [210621.021, 374629.926],
            [210622.976, 374630.19],
            [210624.782, 374630.673],
            [210626.448, 374631.372],
            [210627.23, 374631.802],
            [210627.979, 374632.285],
            [210629.384, 374633.41],
            [210630.672, 374634.734],
            [210631.863, 374636.22],
            [210632.976, 374637.828],
            [210636.995, 374644.611],
            [210638.37, 374646.727],
            [210639.236, 374647.797],
            [210639.653, 374648.2],
            [210640.062, 374648.513],
            [210640.467, 374648.745],
            [210640.875, 374648.907],
            [210641.29, 374649.006],
            [210641.718, 374649.055],
            [210642.634, 374649.035],
            [210647.604, 374648.444],
            [210649.895, 374648.037],
            [210651.212, 374647.743],
            [210654.255, 374647.363],
            [210654.255, 374647.363],
            [210654.316, 374647.357],
            [210654.377, 374647.352],
            [210654.438, 374647.346],
            [210654.499, 374647.341],
            [210654.56, 374647.336],
            [210654.621, 374647.331],
            [210654.682, 374647.326],
            [210654.743, 374647.321],
            [210654.804, 374647.316],
            [210654.865, 374647.311],
            [210654.926, 374647.306],
            [210654.987, 374647.302],
            [210655.048, 374647.297],
            [210655.109, 374647.293],
            [210655.17, 374647.289],
            [210655.231, 374647.285],
            [210655.292, 374647.28],
            [210655.353, 374647.276],
            [210655.414, 374647.273],
            [210655.475, 374647.269],
            [210655.536, 374647.265],
            [210655.598, 374647.262],
            [210655.659, 374647.258],
            [210655.72, 374647.255],
            [210655.781, 374647.252],
            [210655.842, 374647.248],
            [210655.903, 374647.245],
            [210655.964, 374647.242],
            [210656.025, 374647.24],
            [210656.087, 374647.237],
            [210656.148, 374647.234],
            [210656.209, 374647.232],
            [210656.27, 374647.229],
            [210656.331, 374647.227],
            [210656.392, 374647.225],
            [210656.453, 374647.222],
            [210656.515, 374647.22],
            [210656.576, 374647.218],
            [210656.637, 374647.216],
            [210656.698, 374647.215],
            [210656.759, 374647.213],
            [210656.821, 374647.211],
            [210656.882, 374647.21],
            [210656.943, 374647.209],
            [210657.004, 374647.207],
            [210657.065, 374647.206],
            [210657.126, 374647.205],
            [210657.188, 374647.204],
            [210657.249, 374647.203],
            [210657.31, 374647.203],
            [210657.371, 374647.202],
            [210657.432, 374647.201],
            [210657.494, 374647.201],
            [210657.555, 374647.201],
            [210657.616, 374647.2],
            [210657.677, 374647.2],
            [210657.738, 374647.2],
            [210657.8, 374647.2],
            [210657.861, 374647.2],
            [210657.922, 374647.201],
            [210657.983, 374647.201],
            [210658.045, 374647.201],
            [210658.106, 374647.202],
            [210658.167, 374647.203],
            [210658.228, 374647.203],
            [210658.289, 374647.204],
            [210658.35, 374647.205],
            [210658.412, 374647.206],
            [210658.473, 374647.207],
            [210658.534, 374647.208],
            [210658.595, 374647.21],
            [210658.656, 374647.211],
            [210658.718, 374647.213],
            [210658.779, 374647.214],
            [210658.84, 374647.216],
            [210658.901, 374647.218],
            [210658.962, 374647.22],
            [210659.023, 374647.222],
            [210659.085, 374647.224],
            [210659.146, 374647.226],
            [210659.207, 374647.229],
            [210659.268, 374647.231],
            [210659.329, 374647.234],
            [210659.39, 374647.236],
            [210659.452, 374647.239],
            [210659.513, 374647.242],
            [210659.574, 374647.245],
            [210659.635, 374647.248],
            [210659.696, 374647.251],
            [210659.757, 374647.254],
            [210659.818, 374647.258],
            [210659.879, 374647.261],
            [210659.941, 374647.265],
            [210660.002, 374647.268],
            [210660.063, 374647.272],
            [210660.124, 374647.276],
            [210660.185, 374647.28],
            [210660.246, 374647.284],
            [210660.307, 374647.288],
            [210660.307, 374647.288],
            [210658.96, 374628.308],
            [210658.96, 374628.308],
            [210658.952, 374628.172],
            [210658.945, 374628.036],
            [210658.942, 374627.899],
            [210658.94, 374627.763],
            [210658.941, 374627.627],
            [210658.944, 374627.49],
            [210658.95, 374627.354],
            [210658.957, 374627.218],
            [210658.967, 374627.082],
            [210658.98, 374626.946],
            [210658.995, 374626.811],
            [210659.012, 374626.675],
            [210659.031, 374626.54],
            [210659.053, 374626.406],
            [210659.077, 374626.271],
            [210659.103, 374626.138],
            [210659.131, 374626.004],
            [210659.162, 374625.871],
            [210659.195, 374625.739],
            [210659.23, 374625.607],
            [210659.268, 374625.476],
            [210659.308, 374625.346],
            [210659.35, 374625.216],
            [210659.394, 374625.087],
            [210659.44, 374624.959],
            [210659.489, 374624.831],
            [210659.54, 374624.705],
            [210659.592, 374624.579],
            [210659.647, 374624.454],
            [210659.704, 374624.33],
            [210659.764, 374624.208],
            [210659.825, 374624.086],
            [210659.888, 374623.965],
            [210659.954, 374623.845],
            [210660.021, 374623.727],
            [210660.091, 374623.61],
            [210660.162, 374623.493],
            [210660.236, 374623.378],
            [210660.311, 374623.265],
            [210660.388, 374623.152],
            [210660.467, 374623.041],
            [210660.548, 374622.932],
            [210660.631, 374622.824],
            [210660.716, 374622.717],
            [210660.803, 374622.611],
            [210660.891, 374622.507],
            [210660.981, 374622.405],
            [210661.073, 374622.304],
            [210661.167, 374622.205],
            [210661.262, 374622.107],
            [210661.359, 374622.011],
            [210661.457, 374621.917],
            [210661.557, 374621.825],
            [210661.659, 374621.734],
            [210661.762, 374621.644],
            [210661.867, 374621.557],
            [210661.973, 374621.472],
            [210662.08, 374621.388],
            [210662.19, 374621.306],
            [210662.3, 374621.226],
            [210662.412, 374621.148],
            [210662.525, 374621.071],
            [210662.639, 374620.997],
            [210662.755, 374620.925],
            [210662.871, 374620.854],
            [210662.989, 374620.786],
            [210663.109, 374620.72],
            [210663.229, 374620.655],
            [210663.35, 374620.593],
            [210663.473, 374620.533],
            [210663.596, 374620.475],
            [210663.72, 374620.419],
            [210663.846, 374620.365],
            [210663.972, 374620.313],
            [210664.099, 374620.264],
            [210664.227, 374620.216],
            [210664.355, 374620.171],
            [210664.485, 374620.128],
            [210664.615, 374620.087],
            [210664.746, 374620.049],
            [210664.877, 374620.013],
            [210665.009, 374619.979],
            [210665.142, 374619.947],
            [210665.275, 374619.917],
            [210665.409, 374619.89],
            [210665.543, 374619.865],
            [210665.677, 374619.842],
            [210665.812, 374619.822],
            [210665.947, 374619.804],
            [210666.082, 374619.788],
            [210666.218, 374619.774],
            [210666.354, 374619.763],
            [210666.49, 374619.754],
            [210666.626, 374619.748],
            [210666.763, 374619.744],
            [210666.899, 374619.742],
            [210667.035, 374619.742],
            [210667.172, 374619.745],
            [210667.308, 374619.75],
            [210667.308, 374619.75],
            [210697.798, 374621.155],
            [210697.798, 374621.155],
            [210698.125, 374621.171],
            [210698.452, 374621.188],
            [210698.779, 374621.206],
            [210699.106, 374621.226],
            [210699.433, 374621.247],
            [210699.76, 374621.27],
            [210700.087, 374621.293],
            [210700.413, 374621.318],
            [210700.74, 374621.345],
            [210701.066, 374621.373],
            [210701.393, 374621.402],
            [210701.719, 374621.432],
            [210702.045, 374621.464],
            [210702.371, 374621.497],
            [210702.696, 374621.532],
            [210703.022, 374621.567],
            [210703.347, 374621.605],
            [210703.673, 374621.643],
            [210703.998, 374621.683],
            [210704.323, 374621.724],
            [210704.648, 374621.766],
            [210704.972, 374621.81],
            [210705.297, 374621.855],
            [210705.621, 374621.902],
            [210705.945, 374621.95],
            [210706.269, 374621.999],
            [210706.593, 374622.049],
            [210706.916, 374622.101],
            [210707.239, 374622.154],
            [210707.562, 374622.208],
            [210707.885, 374622.264],
            [210708.208, 374622.321],
            [210708.53, 374622.379],
            [210708.852, 374622.439],
            [210709.174, 374622.5],
            [210709.496, 374622.562],
            [210709.817, 374622.626],
            [210710.138, 374622.691],
            [210710.459, 374622.757],
            [210710.779, 374622.825],
            [210711.1, 374622.894],
            [210711.419, 374622.964],
            [210711.739, 374623.035],
            [210712.059, 374623.108],
            [210712.378, 374623.182],
            [210712.696, 374623.258],
            [210713.015, 374623.334],
            [210713.333, 374623.412],
            [210713.651, 374623.492],
            [210713.968, 374623.572],
            [210714.285, 374623.654],
            [210714.602, 374623.738],
            [210714.919, 374623.822],
            [210715.235, 374623.908],
            [210715.551, 374623.995],
            [210715.866, 374624.083],
            [210716.181, 374624.173],
            [210716.496, 374624.264],
            [210716.81, 374624.356],
            [210717.124, 374624.45],
            [210717.438, 374624.545],
            [210717.751, 374624.641],
            [210718.063, 374624.738],
            [210718.376, 374624.837],
            [210718.688, 374624.937],
            [210718.999, 374625.038],
            [210719.31, 374625.141],
            [210719.621, 374625.244],
            [210719.931, 374625.35],
            [210720.241, 374625.456],
            [210720.551, 374625.563],
            [210720.86, 374625.672],
            [210721.168, 374625.782],
            [210721.476, 374625.894],
            [210721.784, 374626.007],
            [210722.091, 374626.12],
            [210722.397, 374626.236],
            [210722.704, 374626.352],
            [210723.009, 374626.47],
            [210723.315, 374626.589],
            [210723.619, 374626.709],
            [210723.924, 374626.83],
            [210724.227, 374626.953],
            [210724.531, 374627.077],
            [210724.833, 374627.202],
            [210725.135, 374627.328],
            [210725.437, 374627.456],
            [210725.738, 374627.585],
            [210726.039, 374627.715],
            [210726.339, 374627.846],
            [210726.639, 374627.979],
            [210726.938, 374628.112],
            [210727.236, 374628.247],
            [210727.534, 374628.384],
            [210727.831, 374628.521],
            [210728.128, 374628.66],
            [210728.424, 374628.8],
            [210728.72, 374628.941],
            [210729.015, 374629.083],
            [210729.015, 374629.083],
            [210771.966, 374649.905],
            [210771.966, 374649.905],
            [210772.156, 374649.999],
            [210772.345, 374650.095],
            [210772.532, 374650.194],
            [210772.718, 374650.296],
            [210772.903, 374650.4],
            [210773.086, 374650.507],
            [210773.267, 374650.616],
            [210773.447, 374650.728],
            [210773.625, 374650.842],
            [210773.802, 374650.959],
            [210773.977, 374651.079],
            [210774.151, 374651.201],
            [210774.322, 374651.325],
            [210774.492, 374651.452],
            [210774.66, 374651.581],
            [210774.826, 374651.713],
            [210774.99, 374651.847],
            [210775.153, 374651.983],
            [210775.313, 374652.121],
            [210775.472, 374652.262],
            [210775.628, 374652.405],
            [210775.782, 374652.55],
            [210775.935, 374652.697],
            [210776.085, 374652.847],
            [210776.233, 374652.998],
            [210776.379, 374653.152],
            [210776.523, 374653.308],
            [210776.665, 374653.465],
            [210776.804, 374653.625],
            [210776.941, 374653.786],
            [210777.076, 374653.95],
            [210777.208, 374654.115],
            [210777.338, 374654.283],
            [210777.466, 374654.452],
            [210777.591, 374654.623],
            [210777.714, 374654.795],
            [210777.835, 374654.97],
            [210777.953, 374655.146],
            [210778.068, 374655.323],
            [210778.181, 374655.503],
            [210778.292, 374655.684],
            [210778.399, 374655.866],
            [210778.505, 374656.05],
            [210778.607, 374656.235],
            [210778.707, 374656.422],
            [210778.805, 374656.61],
            [210778.899, 374656.8],
            [210778.991, 374656.991],
            [210779.081, 374657.183],
            [210779.167, 374657.376],
            [210779.251, 374657.571],
            [210779.332, 374657.767],
            [210779.41, 374657.964],
            [210779.486, 374658.162],
            [210779.559, 374658.361],
            [210779.629, 374658.561],
            [210779.696, 374658.762],
            [210779.76, 374658.964],
            [210779.821, 374659.167],
            [210779.88, 374659.37],
            [210779.935, 374659.575],
            [210779.988, 374659.78],
            [210780.038, 374659.986],
            [210780.085, 374660.193],
            [210780.129, 374660.4],
            [210780.17, 374660.608],
            [210780.208, 374660.816],
            [210780.243, 374661.025],
            [210780.275, 374661.235],
            [210780.304, 374661.445],
            [210780.331, 374661.655],
            [210780.354, 374661.866],
            [210780.374, 374662.077],
            [210780.392, 374662.288],
            [210780.406, 374662.499],
            [210780.417, 374662.711],
            [210780.426, 374662.923],
            [210780.431, 374663.134],
            [210780.433, 374663.346],
            [210780.433, 374663.558],
            [210780.429, 374663.77],
            [210780.423, 374663.982],
            [210780.413, 374664.194],
            [210780.4, 374664.405],
            [210780.385, 374664.617],
            [210780.366, 374664.828],
            [210780.345, 374665.039],
            [210780.32, 374665.249],
            [210780.293, 374665.459],
            [210780.262, 374665.669],
            [210780.229, 374665.878],
            [210780.193, 374666.087],
            [210780.153, 374666.295],
            [210780.111, 374666.503],
            [210780.066, 374666.71],
            [210780.018, 374666.916],
            [210779.967, 374667.122],
            [210779.913, 374667.327],
            [210779.856, 374667.531],
            [210779.856, 374667.531],
            [210795.087, 374661.569],
            [210798.801, 374671.058],
            [210800.296, 374674.945],
            [210805.37, 374672.805],
            [210809.94, 374683.854],
            [210804.247, 374686.255],
          ],
        ],
      ],
    },
  };
  merge(document, data);

  return document;
}