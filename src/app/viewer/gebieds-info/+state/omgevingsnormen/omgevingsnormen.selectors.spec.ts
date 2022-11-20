import { omgevingsnormenMock, omgevingsnormenVM } from './omgevingsnormen.mock';
import * as fromSelectors from './omgevingsnormen.selectors';
import * as fromOmgevingsnormen from './omgevingsnormen.reducer';

describe('OmgevingsnormenSelectors Selectors', () => {
  it('selectOmgevingsnormen', () => {
    expect(
      fromSelectors.selectOmgevingsnormenVM.projector([
        { entityId: fromOmgevingsnormen.entityId, data: omgevingsnormenMock },
      ])
    ).toEqual([omgevingsnormenVM]);
  });
});
