import { TekstLinks } from '~ihr-model/tekstLinks';
import { Tekst } from '~ihr-model/tekst';

export const linksObject: TekstLinks = {
  self: { href: 'leukeUrl' },
  children: [],
  bestemmingsvlakken: [],
  bouwaanduidingen: [],
  figuren: [],
  functieaanduidingen: [],
  gebiedsaanduidingen: [],
  lettertekenaanduidingen: [],
  maatvoeringen: [],
  besluitvlakken: [],
  besluitsubvlakken: [],
  structuurvisiegebieden: [],
  structuurvisiecomplexen: [],
  structuurvisieverklaringen: [],
};

export const ihrDocumentElementResponse: Tekst = {
  id: 'opaPietje',
  titel: 'Groeten uit Lochem',
  inhoud: '',
  volgnummer: 1,
  externeReferentie: null,
  kruimelpad: [],
  _embedded: {
    children: [
      {
        id: 'pietjesKind',
        titel: 'Hallo',
        inhoud: 'met inhoud',
        volgnummer: 2,
        externeReferentie: null,
        kruimelpad: [],
        _embedded: {
          children: [
            {
              id: 'pietjesKleinkind',
              titel: '',
              inhoud: 'nog meer inhoud',
              volgnummer: 2,
              externeReferentie: null,
              kruimelpad: [],
              _links: linksObject,
            },
          ],
        },
        _links: linksObject,
      },
    ],
  },
  _links: linksObject,
};
