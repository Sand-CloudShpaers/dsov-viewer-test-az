import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { ErrorMessage } from '~model/error-message';

import { CustomErrorHandler } from './custom-error-handler';

describe('CustomErrorHandler', () => {
  let spectator: SpectatorService<CustomErrorHandler>;

  const createService = createServiceFactory({
    service: CustomErrorHandler,
    providers: [],
    mocks: [],
  });

  beforeEach(() => {
    spectator = createService();
    spyOn(console, 'error');
  });

  describe('handleError', () => {
    const error: ErrorMessage = {
      message: 'message',
      status: 404,
    };
    it('should console.error', () => {
      spectator.service.handleError(error);

      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });
});
