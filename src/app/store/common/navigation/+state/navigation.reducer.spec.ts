import { initialState, reducer as navigationReducer } from './navigation.reducer';
import * as NavigationActions from './navigation.actions';
import { ViewerPage } from '~store/common/navigation/types/application-page';

describe('navigationReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = navigationReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should set navigation path', () => {
    const action = NavigationActions.setNavigationPath({
      page: ViewerPage.OVERZICHT,
      path: 'path/met/slashes',
    });
    const actual = navigationReducer(initialState, action);

    expect(actual).toEqual({
      [ViewerPage.OVERZICHT]: 'path/met/slashes',
      [ViewerPage.ACTIVITEITEN]: null,
      [ViewerPage.THEMAS]: null,
      [ViewerPage.GEBIEDEN]: null,
      [ViewerPage.DOCUMENTEN]: null,
      [ViewerPage.REGELSOPMAAT]: null,
      [ViewerPage.DOCUMENT]: null,
    });
  });

  it('should reset path', () => {
    const action = NavigationActions.resetNavigationPaths();
    const actual = navigationReducer(initialState, action);

    expect(actual).toEqual({
      [ViewerPage.OVERZICHT]: null,
      [ViewerPage.ACTIVITEITEN]: null,
      [ViewerPage.THEMAS]: null,
      [ViewerPage.GEBIEDEN]: null,
      [ViewerPage.DOCUMENTEN]: null,
      [ViewerPage.REGELSOPMAAT]: null,
      [ViewerPage.DOCUMENT]: null,
    });
  });
});
