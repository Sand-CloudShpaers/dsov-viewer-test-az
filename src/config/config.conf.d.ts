export interface ApplicationConfig {
  ihr?: IHRConfigProperties;
  ozon?: ConfigProperties;
  ozonVerbeelden?: ConfigProperties;
  locationService: ConfigProperties;
  wfsBestuurlijkegebieden?: ConfigProperties;
  wfsBag?: ConfigProperties;
  wfsKadastralekaart?: ConfigProperties;
  bestuurlijkeGrenzen: ConfigProperties;
  rdNapTrans: ConfigProperties;
  vergunningsCheck?: ConfigProperties;
  // voor ophalen vt styles
  pdokRuimtelijkeplannen?: ConfigProperties;
  cmsContact?: ConfigProperties;
  cmsVragenAntwoorden?: ConfigProperties;
  cmsAlgemeneUitleg?: ConfigProperties;
  pdok: ConfigProperties;
  iwt: { date: string };

  [key: string]: ApplicationConfig[keyof ApplicationConfig];
}

interface ConfigProperties {
  url: string;
  apiKey?: string;
}

interface IHRConfigProperties extends ConfigProperties {
  disabled?: boolean;
}
