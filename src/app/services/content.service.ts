import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { normalizeString } from '~general/utils/string.utils';
import { NoCacheHeaders } from './no-cache-headers';

export enum ContentKeys {
  ACTIVITEITEN = 'activiteiten',
  DOCUMENTENLOCATIE = 'documentenlocatie',
  GEBIEDEN = 'gebieden',
  GEBIEDSAANWIJZINGEN = 'gebiedsaanwijzingen',
  OMGEVINGSNORMEN = 'omgevingsnormen',
  OMGEVINGSWAARDEN = 'omgevingswaarden',
  REGELSTATUS = 'regelstatus',
  REGELTEKSTTYPE = 'regelteksttype',
  REGELTYPE = 'regeltype',
  THEMAS = 'themas',
}

@Injectable()
export class ContentService {
  private static readonly CONFIG_FILE = 'config/content/content.json';
  private _content: { [key: string]: string };

  constructor(private http: HttpClient) {}

  public load(): Promise<{ [key: string]: string }> {
    return lastValueFrom(
      this.http.get<{ [key: string]: string }>(ContentService.CONFIG_FILE, {
        headers: NoCacheHeaders,
      })
    ).then(content => {
      this._content = content;
      return content;
    });
  }

  public getRichContent(key: string): string {
    return this._content ? this._content[normalizeString(key)] || '' : '';
  }
}
