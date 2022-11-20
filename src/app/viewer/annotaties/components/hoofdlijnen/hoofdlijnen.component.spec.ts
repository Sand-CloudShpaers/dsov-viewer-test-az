import { HoofdlijnenComponent } from './hoofdlijnen.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { CollapsibleListComponent } from '~viewer/components/collapsible-list/collapsible-list.component';

describe('HoofdlijnenComponent', () => {
  let spectator: Spectator<HoofdlijnenComponent>;
  const createComponent = createComponentFactory({
    component: HoofdlijnenComponent,
    providers: [],
    declarations: [MockComponent(HoofdlijnenComponent), MockComponent(CollapsibleListComponent)],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        hoofdlijnen: [
          {
            identificatie: 'id',
            naam: 'naam',
            hoofdlijnen: [
              {
                identificatie: 'id',
                naam: 'naam',
                soort: 'soort',
                isOntwerp: false,
              },
            ],
          },
        ],
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have 1 group of "hoofdlijnen"', () => {
    expect(spectator.queryAll('dsov-collapsible-list').length).toEqual(1);
  });
});
