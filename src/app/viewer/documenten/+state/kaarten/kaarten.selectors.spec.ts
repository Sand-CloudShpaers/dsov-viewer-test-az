import * as fromSelectors from './kaarten.selectors';
import { kaartenMock, kaartVMMocks } from '~viewer/documenten/+state/kaarten/kaarten.mock';
import { selectionMock } from '~store/common/selection/+state/selection-mock';

const id = '/akn/nl/act/gm0983/2020/OOWVVVReg';

describe('KaartenSelectors', () => {
  describe('selectKaartenByDocumentId ', () => {
    it('should return empty array on undefined or empty selectKaartenEntities', () => {
      expect(fromSelectors.selectKaartenByDocumentId(id).projector([])).toEqual([]);
    });

    it('should return kaarten with same selectedDocumentId', () => {
      expect(
        fromSelectors.selectKaartenByDocumentId(id).projector(
          [
            {
              data: kaartenMock,
              entityId: id,
              status: 'RESOLVED',
            },
          ],
          [selectionMock]
        )
      ).toEqual(kaartVMMocks);
    });

    it('should not return kaarten with other selectedDocumentId', () => {
      expect(
        fromSelectors.selectKaartenByDocumentId(`${id}_anders`).projector(
          [
            {
              data: kaartenMock,
              entityId: id,
              status: 'RESOLVED',
            },
          ],
          [selectionMock]
        )
      ).not.toEqual(kaartVMMocks);
    });
  });
});
