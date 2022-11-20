import { createRoutingFactory, Spectator } from '@ngneat/spectator';
import { HomeComponent } from './home.component';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '~services/config.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  let spectator: Spectator<HomeComponent>;

  const createComponent = createRoutingFactory({
    component: HomeComponent,
    providers: [
      ActivatedRoute,
      {
        provide: ConfigService,
        useValue: {
          config: {
            ihr: {
              disabled: 'false',
            },
            vergunningsCheck: {
              url: 'url',
              apiKey: 'key',
            },
            iwt: {
              date: '2022/02/01',
            },
          },
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({});
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should give vergunningscheck URL', () => {
    expect(spectator.component.getVergunningsCheckUrl()).toEqual('url');
  });
});
