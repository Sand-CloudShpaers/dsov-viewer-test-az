import { ImroKaartStyleConfig, ImroPlanResponse } from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.model';
import * as fromSelectors from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.selectors';

export const kaartenImroConfigsMock: ImroKaartStyleConfig[] = [
  {
    id: 'kaart1',
    naam: 'Fraaie Kaart',
    url: 'url/naar/kaartstyle1',
    style: {
      sources: {},
      version: 8,
      layers: [],
    },
  },
  {
    id: 'kaart2',
    naam: 'NL.IMRO.plan-met-kaarten',
    url: 'url/naar/kaartstyle2',
    style: {
      sources: {},
      version: 8,
      layers: [],
    },
  },
];

export const imroPlanResponseMock: ImroPlanResponse = {
  id: 'testId',
  type: 'bestemmingsplan',
  documentType: 'IMRO2012',
  naam: 'plannetje',
  bounds: [1, 1, 1, 1],
  styles: kaartenImroConfigsMock,
};

describe('KaartenImro Selectors', () => {
  it('should return imro kaarten config for plan with documentId', () => {
    expect(
      fromSelectors.selectStyleConfigs('testId').projector({
        testId: {
          data: imroPlanResponseMock,
          entityId: 'testId',
          status: 'RESOLVED',
        },
      })
    ).toEqual(kaartenImroConfigsMock);
  });
});
