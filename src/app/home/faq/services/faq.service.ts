import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck, share } from 'rxjs/operators';
import { CmsHttpClient } from '~http/cms.http-client';
import { FaqInfo, FaqItem, FaqJson, FaqJsonObject } from '../types/faq-items';
import { ConfigService } from '~services/config.service';

@Injectable()
export class FaqService {
  private static readonly FAQ_INDEX_ID = 'dso:faqindex';
  private static readonly CONTENT_INDEX_ID = 'dso:faq';

  constructor(private cmsHttpClient: CmsHttpClient, private configService: ConfigService) {}

  public fetchFaqInfo(): FaqInfo {
    const faqJson$ = this.cmsHttpClient.get$<FaqJson>(this.configService.config.cmsVragenAntwoorden.url).pipe(share());
    return {
      leadIn$: FaqService.getLeadInFromDsoJson$(faqJson$),
      questions$: FaqService.getQuestionsFromDsoJson$(faqJson$),
    };
  }

  private static getLeadInFromDsoJson$(faqJson: Observable<FaqJson>): Observable<FaqItem> {
    return faqJson.pipe(
      pluck('objects'),
      map((objects: FaqJsonObject[]) =>
        objects.find(cmsObject => cmsObject.object.properties['cmis:objectTypeId'].value === FaqService.FAQ_INDEX_ID)
      ),
      pluck('object', 'properties'),
      map(properties => ({
        title: properties['dso:Tit'].value,
        content: properties['dso:Inhoud/Inleiding'].value,
      }))
    );
  }

  private static getQuestionsFromDsoJson$(faqJson: Observable<FaqJson>): Observable<FaqItem[]> {
    return faqJson.pipe(
      pluck('objects'),
      map((objects: FaqJsonObject[]) =>
        objects.filter(
          cmsObject => cmsObject.object.properties['cmis:objectTypeId'].value === FaqService.CONTENT_INDEX_ID
        )
      ),
      map(objects => objects.map(cmsObject => cmsObject.object.properties)),
      map(propertiesArray =>
        propertiesArray.map(properties => ({
          title: properties['dso:Tit'].value,
          content: properties['dso:Inhoud/Antwoord'].value,
          open: false,
        }))
      )
    );
  }
}
