import { getOmgevingsnormenArray } from '~viewer/annotaties/helpers/omgevingsnormen';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';
import { omgevingsnormenWithEenheidMock } from '~viewer/gebieds-info/+state/omgevingsnormen/omgevingsnormen.mock';
import { OmgevingswaardenVMFactory } from '~viewer/gebieds-info/+state/omgevingswaarden/omgevingswaarden.mock';
import { ApiSource } from '~model/internal/api-source';
import { SelectionObjectType } from '~store/common/selection/selection.model';

describe('omgevingsnormen', () => {
  describe('getOmgevingsnormenArray', () => {
    /* Andere paden worden getest via omgevingsnormen.selectors.spec, omgevingswaarden.selectors.spec en
     annotaties.selectors.spec */
    it('should return eenheid for norm(en)', () => {
      expect(
        getOmgevingsnormenArray(omgevingsnormenWithEenheidMock, [], NormType.OMGEVINGSNORMEN, [
          { id: 'norm', apiSource: ApiSource.OZON, name: 'document', objectType: SelectionObjectType.REGELINGSGEBIED },
        ])
      ).toEqual([OmgevingswaardenVMFactory.createOmgevingswaardenVM(NormType.OMGEVINGSNORMEN, { eenheid: '-4' })]);
    });
  });
});
