import { mockLocatieMetBoundingBox } from './document-locatie.effects.spec';
import * as fromSelectors from './document-locatie.selectors';

const id = '/akn/nl/act/1032';

describe('DocumentLocatieSelectors', () => {
  it('should return extent', () => {
    expect(
      fromSelectors.getExtent(id).projector({
        [id]: {
          data: mockLocatieMetBoundingBox,
          entityId: id,
          status: 'RESOLVED',
        },
      })
    ).toEqual([0, 0, 0, 0]);
  });

  it('should return undefined, when no documents', () => {
    expect(fromSelectors.getExtent(id).projector(undefined)).toEqual(undefined);
  });

  it('should return undefined, when not found', () => {
    expect(
      fromSelectors.getExtent(id).projector({
        ['geenId']: {
          data: 'geenId',
          entityId: id,
          status: 'RESOLVED',
        },
      })
    ).toEqual(undefined);
  });
});
