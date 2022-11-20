import * as fromSelectors from './omgevingswaarden.selectors';
import { omgevingswaardenMock, OmgevingswaardenVMFactory } from './omgevingswaarden.mock';
import * as fromOmgevingswaarden from './omgevingswaarden.reducer';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';

describe('OmgevingswaardenSelectors Selectors', () => {
  it('selectOmgevingswaarden', () => {
    expect(
      fromSelectors.selectOmgevingswaardenVM.projector([
        { entityId: fromOmgevingswaarden.entityId, data: omgevingswaardenMock },
      ])
    ).toEqual([OmgevingswaardenVMFactory.createOmgevingswaardenVM(NormType.OMGEVINGSWAARDEN)]);
  });
});
