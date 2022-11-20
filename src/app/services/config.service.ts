import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApplicationConfig } from '~config/config.conf';

export const OZON_PAGE_SIZE = 200;

@Injectable()
export class ConfigService {
  private static readonly CONFIG_FILE = 'config/config.conf';
  public readonly ozonMaxResponseSize = OZON_PAGE_SIZE;

  // default values
  private readonly setGegevenscatalogusUrl = 'config/gegevenscatalogus';

  private frozenConfig: Readonly<ApplicationConfig>;

  constructor(private http: HttpClient) {}

  public get config(): Readonly<ApplicationConfig> {
    return this.frozenConfig;
  }

  public get gegevenscatalogusUrl(): string {
    return this.setGegevenscatalogusUrl;
  }

  public load(): Promise<ApplicationConfig> {
    return lastValueFrom(this.http.get<ApplicationConfig>(ConfigService.CONFIG_FILE)).then(settings => {
      this.setConfig(settings);
      return settings;
    });
  }

  public setConfig(config: ApplicationConfig): void {
    this.frozenConfig = Object.freeze(config);
  }
}
