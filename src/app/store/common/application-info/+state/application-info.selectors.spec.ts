import { LoadingState } from '~model/loading-state.enum';
import { derivedLoadingState } from '~general/utils/store.utils';
import * as fromApplicationInfo from './application-info.selectors';
import { ApplicationInfo } from '../types/application-info';
import {
  IhrSpecificationVersion,
  OzonPresenterenSpecificationVersion,
  OzonVerbeeldenSpecificationVersion,
} from '~config/specification-version';

describe('application-info.selectors', () => {
  const mockApplicationInfo: ApplicationInfo[] = [
    {
      version: '6.3.1',
      name: 'Presenteren API',
      models: [
        {
          version: OzonPresenterenSpecificationVersion,
          name: 'In gebruik',
        },
        {
          version: '2.0.0',
          name: 'CIMOW',
        },
        {
          version: '1.1.0',
          name: 'STOP',
        },
      ],
    },
    {
      version: '2.3.1',
      name: 'Verbeelden API',
      models: [
        {
          version: OzonVerbeeldenSpecificationVersion,
          name: 'In gebruik',
        },
      ],
    },
    {
      version: '4.0.0',
      name: 'Ruimtelijke Plannen API',
      models: [
        {
          version: IhrSpecificationVersion,
          name: 'In gebruik',
        },
      ],
    },
  ];

  describe('selectApplicationInfo', () => {
    it('should return application info', () => {
      expect(
        fromApplicationInfo.selectApplicationInfo.projector({
          ozonPresenteren: {
            app: {
              version: '6.3.1',
              cimowVersion: '2.0.0',
              stopVersion: '1.1.0',
            },
          },
          ozonVerbeelden: {
            app: {
              version: '2.3.1',
            },
          },
          ihr: { version: '4.0.0' },
          status: LoadingState.RESOLVED,
          error: null,
        })
      ).toEqual(mockApplicationInfo);
    });
  });

  describe('selectStatus', () => {
    it('should return PENDING state', () => {
      expect(
        fromApplicationInfo.selectStatus.projector({
          ozon: null,
          ihr: null,
          status: LoadingState.PENDING,
          error: null,
        })
      ).toEqual(derivedLoadingState(LoadingState.PENDING));
    });
  });
});
