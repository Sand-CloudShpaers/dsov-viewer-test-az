export interface ApplicationInfo {
  name: string;
  version: string;
  models?: ApplicationInfoModel[];
}

export interface ApplicationInfoModel {
  name: string;
  version: string;
}
