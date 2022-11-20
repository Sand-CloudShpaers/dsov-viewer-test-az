import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { DocumentStructuurOzonService } from './document-structuur-ozon.service';

describe('DocumentStructuurOzonService', () => {
  let spectator: SpectatorService<DocumentStructuurOzonService>;

  const createService = createServiceFactory({
    service: DocumentStructuurOzonService,
    imports: [],
    providers: [],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });
});
