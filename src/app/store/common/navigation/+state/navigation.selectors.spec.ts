import * as fromSelectors from './navigation.selectors';
import { NavigationPaths } from '~store/common/navigation/types/navigation-paths';
import { ViewerPage } from '~store/common/navigation/types/application-page';

const navigationPaths: NavigationPaths = {
  [ViewerPage.OVERZICHT]: 'overzicht',
  [ViewerPage.ACTIVITEITEN]: 'activiteiten',
  [ViewerPage.THEMAS]: 'themas',
  [ViewerPage.GEBIEDEN]: 'gebieden',
  [ViewerPage.DOCUMENTEN]: 'documenten',
  [ViewerPage.REGELSOPMAAT]: 'regelsopmaat',
  [ViewerPage.DOCUMENT]: 'document',
};

describe('Navigation Selectors', () => {
  describe('getNavigationState ', () => {
    it('should return navigation paths state', () => {
      expect(fromSelectors.getNavigationState.projector({ navigations: navigationPaths })).toEqual(navigationPaths);
    });
  });

  describe('selectNavigationPaths ', () => {
    it('should return navigation paths', () => {
      expect(fromSelectors.selectNavigationPaths.projector(navigationPaths)).toEqual(navigationPaths);
    });
  });
});
