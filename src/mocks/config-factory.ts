import { ApplicationConfig } from '~config/config.conf';

export class ConfigFactory {
  public static createConfig(): ApplicationConfig {
    return {
      iwt: { date: '2022/02/01' },
      ihr: {
        url: 'https://ruimte.omgevingswet.overheid.nl/ruimtelijke-plannen/api/opvragen/v4',
        apiKey: 'l748f36af7648c43cd8b9a7183218f26e1',
      },
      ozon: {
        url: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v6',
        apiKey: 'f9303b04-8db4-4d34-b2a9-356ba490f977',
      },
      ozonVerbeelden: {
        url: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/verbeelden/v2',
        apiKey: 'f9303b04-8db4-4d34-b2a9-356ba490f977',
      },
      locationService: {
        url: 'https://geodata.nationaalgeoregister.nl/locatieserver/v3',
      },
      wfsKadastralekaart: {
        url: 'https://geodata.nationaalgeoregister.nl/kadastralekaart/wfs/v4_0?service=WFS&request=getFeature&version=2.0.0&typenames=kadastralekaartv4:perceel&srsName=EPSG:28992&outputFormat=application/json',
      },
      bestuurlijkeGrenzen: {
        url: 'https://brk.basisregistraties.overheid.nl/api/bestuurlijke-grenzen/v2',
        apiKey: 'd379f340-6900-4b3c-9e10-b6a4296fdfca',
      },
      rdNapTrans: {
        url: 'https://api.transformation.nsgi.nl/v1/transform/',
        apiKey: '4e765538-16d7-4698-af1b-ea3883d00798',
      },
      vergunningsCheck: {
        url: 'https://acc.omgevingswet.overheid.nl/checken',
      },
      pdokRuimtelijkeplannen: {
        url: 'https://service.pdok.nl/omgevingswet/ruimtelijkeplannen/api/v1_0/plannen',
      },
      cmsContact: {
        url: 'https://int-dso.iprox.nl/cmis/site-13/root/content-(test)/contact-pagina',
      },
      cmsVragenAntwoorden: {
        url: 'https://int-dso.iprox.nl/cmis/site-13/root/vragen-antwoorden?filter=dso:Tit,dso:Inhoud/Inleiding,dso:Inhoud/Antwoord,cmis:objectTypeId',
      },
      cmsAlgemeneUitleg: {
        url: 'https://int-dso.iprox.nl/cmis/site-13/root/content-(test)/help-pagina-viewer',
      },
      pdok: {
        url: 'https://geodata.nationaalgeoregister.nl/',
      },
    };
  }
}
