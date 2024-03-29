import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { Tekst } from '~ihr-model/tekst';

export const mockIHRTekst: Tekst = {
  externeReferentie: {
    href: '',
    label: '',
  },
  id: 'NL.IMRO.PT.regels._1_INLEIDENDEREGELS',
  titel: 'Hoofdstuk 1 INLEIDENDE REGELS',
  volgnummer: 3,
  inhoud: null,
  kruimelpad: [],
  _links: {
    self: null,
    children: [{ href: 'link' }],
    bestemmingsvlakken: [],
    functieaanduidingen: [],
    gebiedsaanduidingen: [],
    lettertekenaanduidingen: [],
    maatvoeringen: [],
    bouwaanduidingen: [],
    figuren: [],
    besluitsubvlakken: [],
    besluitvlakken: [],
    structuurvisiecomplexen: [],
    structuurvisiegebieden: [],
    structuurvisieverklaringen: [],
  },
  _embedded: {
    children: [
      {
        externeReferentie: null,
        id: 'NL.IMRO.PT.regels._1_Begrippen',
        inhoud: 'begrippen uitgelegd',
        titel: 'Artikel 1 Begrippen',
        volgnummer: 4,
        kruimelpad: [],
        _links: {
          self: null,
          children: [],
          bestemmingsvlakken: [],
          functieaanduidingen: [],
          gebiedsaanduidingen: [],
          lettertekenaanduidingen: [],
          maatvoeringen: [],
          bouwaanduidingen: [],
          figuren: [],
          besluitsubvlakken: [],
          besluitvlakken: [],
          structuurvisiecomplexen: [],
          structuurvisiegebieden: [],
          structuurvisieverklaringen: [],
        },
        _embedded: {
          children: [
            {
              externeReferentie: null,
              id: 'NL.IMRO.PT.regels._1.1_plan',
              inhoud: 'begrip plan uitgelegd',
              titel: '1.1 plan',
              volgnummer: 5,
              kruimelpad: [],
              _links: {
                self: null,
                children: [],
                bestemmingsvlakken: [{ href: 'https://link.naar.bestemmingsvlakken' }],
                functieaanduidingen: [],
                gebiedsaanduidingen: [],
                lettertekenaanduidingen: [],
                maatvoeringen: [],
                bouwaanduidingen: [],
                figuren: [],
                besluitsubvlakken: [],
                besluitvlakken: [],
                structuurvisiecomplexen: [],
                structuurvisiegebieden: [],
                structuurvisieverklaringen: [],
              },
            },
          ],
        },
      },
    ],
  },
};

export const mockIHRDocumentBodyElement = {
  id: 'NL.IMRO.PT.regels._1_INLEIDENDEREGELS',
  titel: { content: 'Hoofdstuk 1 INLEIDENDE REGELS' },
  layout: {
    documentViewContext: DocumentViewContext.VOLLEDIG_DOCUMENT,
    isFiltered: true,
    isOpen: true,
    hasActiviteiten: false,
    hasLocaties: false,
    showAnnotation: false,
    showElementen: true,
    showInhoud: false,
    showNummerOnly: false,
    showAdjacentInhoud: false,
    showAdjacentTitle: false,
    showLoading: false,
    showTitle: true,
    showToggle: true,
  },
};
