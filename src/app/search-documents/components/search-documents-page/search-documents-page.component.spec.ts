import { createRoutingFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SearchDocumentsPageComponent } from './search-documents-page.component';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';

describe('SearchDocumentsPageComponent', () => {
  let spectator: Spectator<SearchDocumentsPageComponent>;

  const createComponent = createRoutingFactory({
    component: SearchDocumentsPageComponent,
    providers: [mockProvider(GegevenscatalogusProvider), mockProvider(SelectionFacade)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({});
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
