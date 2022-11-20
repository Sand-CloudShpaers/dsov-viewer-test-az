import { inject, TestBed } from '@angular/core/testing';
import { FaqService } from './faq.service';
import { CmsHttpClient } from '~http/cms.http-client';
import { of } from 'rxjs';
import { ConfigService } from '~services/config.service';
import { FaqItem } from '../types/faq-items';

describe('FaqService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FaqService,
        {
          provide: CmsHttpClient,
          useValue: {
            get$: () =>
              of({
                hasMoreItems: false,
                numItems: 2,
                objects: [
                  {
                    object: {
                      properties: {
                        'cmis:objectTypeId': {
                          cardinality: 'single',
                          localName: 'objectTypeId',
                          propertyDefinitionId: 'cmis:objectTypeId',
                          queryName: 'cmis:objectTypeId',
                          type: 'id',
                          value: 'dso:faqindex',
                        },
                        'dso:Tit': {
                          cardinality: 'single',
                          localName: 'Tit',
                          propertyDefinitionId: 'dso:Tit',
                          queryName: 'dso:Tit',
                          type: 'string',
                          value: 'Ik ben een titel',
                        },
                        'dso:Inhoud/Inleiding': {
                          cardinality: 'single',
                          localName: 'Inhoud/Inleiding',
                          propertyDefinitionId: 'dso:Inhoud/Inleiding',
                          queryName: 'dso:Inhoud/Inleiding',
                          type: 'html',
                          value: '<div><p>Ik ben de inleidende tekst van de veelgestelde vragen</p></div>',
                        },
                      },
                    },
                  },
                  {
                    object: {
                      properties: {
                        'cmis:objectTypeId': {
                          cardinality: 'single',
                          localName: 'objectTypeId',
                          propertyDefinitionId: 'cmis:objectTypeId',
                          queryName: 'cmis:objectTypeId',
                          type: 'id',
                          value: 'dso:faq',
                        },
                        'dso:Tit': {
                          cardinality: 'single',
                          localName: 'Tit',
                          propertyDefinitionId: 'dso:Tit',
                          queryName: 'dso:Tit',
                          type: 'string',
                          value: 'Ben ik een veelgestelde vraag?',
                        },
                        'dso:Inhoud/Antwoord': {
                          cardinality: 'single',
                          localName: 'Inhoud/Antwoord',
                          propertyDefinitionId: 'dso:Inhoud/Antwoord',
                          queryName: 'dso:Inhoud/Antwoord',
                          type: 'html',
                          value: '<div><p>Ja, dat ben ik.</p></div>',
                        },
                      },
                    },
                  },
                ],
              }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            config: {
              cmsVragenAntwoorden: {
                url: 'https://blaat.schaap',
              },
            },
          },
        },
      ],
    });
  });

  it('should be created', inject([FaqService], (service: FaqService) => {
    expect(service).toBeTruthy();
  }));

  describe('fetchFaqInfo', () => {
    it('should return faqInfo leadIn', done =>
      inject([FaqService], (service: FaqService) => {
        service.fetchFaqInfo().leadIn$.subscribe((faqItem: FaqItem) => {
          expect(faqItem).toEqual({
            content: '<div><p>Ik ben de inleidende tekst van de veelgestelde vragen</p></div>',
            title: 'Ik ben een titel',
          });
          done();
        });
      })());

    it('should return faqInfo questions', done =>
      inject([FaqService], (service: FaqService) => {
        service.fetchFaqInfo().questions$.subscribe((faqItems: FaqItem[]) => {
          expect(faqItems).toEqual([
            {
              title: 'Ben ik een veelgestelde vraag?',
              content: '<div><p>Ja, dat ben ik.</p></div>',
              open: false,
            },
          ]);
          done();
        });
      })());
  });
});
