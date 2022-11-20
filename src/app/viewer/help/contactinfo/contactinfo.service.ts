import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CmsHttpClient } from '~http/cms.http-client';
import { ConfigService } from '~services/config.service';

@Injectable()
export class ContactinfoService {
  constructor(private cmsHttpClient: CmsHttpClient, private configService: ConfigService) {}

  public fetchContactinfo$(): Observable<string> {
    return this.cmsHttpClient.get$(this.configService.config.cmsContact.url, {
      responseType: 'text',
      responseOnError: 'Contactinformatie kon niet worden opgehaald',
    });
  }
}
