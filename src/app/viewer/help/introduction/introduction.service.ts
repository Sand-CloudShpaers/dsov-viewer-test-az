import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CmsHttpClient } from '~http/cms.http-client';
import { ConfigService } from '~services/config.service';

@Injectable()
export class IntroductionService {
  constructor(private cmsHttpClient: CmsHttpClient, private configService: ConfigService) {}

  public fetchIntroduction$(): Observable<string> {
    return this.cmsHttpClient.get$(this.configService.config.cmsAlgemeneUitleg.url, {
      responseType: 'text',
      responseOnError: 'Algemene informatie kon niet worden opgehaald',
    });
  }
}
