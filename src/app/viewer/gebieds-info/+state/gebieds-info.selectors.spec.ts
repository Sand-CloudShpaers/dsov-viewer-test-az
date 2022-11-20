import { DerivedLoadingState } from '~general/utils/store.utils';
import * as fromSelectors from './gebieds-info.selectors';
import { mockGebiedsaanwijzingenVM } from './gebiedsaanwijzingen/gebiedsaanwijzingen.mock';
import { omgevingsnormenVM } from './omgevingsnormen/omgevingsnormen.mock';
import { OmgevingswaardenVMFactory } from './omgevingswaarden/omgevingswaarden.mock';
import { ViewSelectionItems } from '~viewer/gebieds-info/types/gebieds-info.model';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';

const loadingState: DerivedLoadingState = {
  isLoading: false,
  isIdle: false,
  isPending: false,
  isResolved: false,
  isRejected: false,
  isLoaded: false,
};

const viewSelectionItems: ViewSelectionItems = {
  omgevingsnormen: [
    {
      identificatie: 'normId',
      naam: 'naam',
    },
  ],
  omgevingswaarden: [
    {
      identificatie: 'normId',
      naam: 'naam',
    },
  ],
  gebiedsaanwijzingen: [
    {
      identificatie: 'identificatie',
      naam: 'naam (Beperkingengebieden)',
    },
  ],
};

describe('GebiedsInfoSelectors', () => {
  it('getViewSelectionLoadingStatus', () => {
    expect(fromSelectors.getViewSelectionLoadingStatus.projector(loadingState, loadingState, loadingState)).toEqual(
      loadingState
    );
  });

  it('getViewSelectionItems', () => {
    expect(
      fromSelectors.getViewSelectionItems.projector(
        [omgevingsnormenVM],
        [OmgevingswaardenVMFactory.createOmgevingswaardenVM(NormType.OMGEVINGSWAARDEN)],
        [mockGebiedsaanwijzingenVM]
      )
    ).toEqual(viewSelectionItems);
  });
});
