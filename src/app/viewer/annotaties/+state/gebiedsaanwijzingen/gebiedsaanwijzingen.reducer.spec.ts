import { initialState, reducer as gebiedsaanwijzingenReducer } from './gebiedsaanwijzingen.reducer';
import * as fromGebiedsaanwijzingen from './gebiedsaanwijzingen.actions';
import { mockGebiedsaanwijzingenEntity } from '~viewer/gebieds-info/+state/gebiedsaanwijzingen/gebiedsaanwijzingen.mock';
import { getAnnotationEntityId } from '~viewer/annotaties/helpers/annotaties';

describe('gebiedsaanwijzingenReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = gebiedsaanwijzingenReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add results on loadSuccess', () => {
    const action = fromGebiedsaanwijzingen.loadSuccess(mockGebiedsaanwijzingenEntity);
    const actual = gebiedsaanwijzingenReducer(initialState, action);

    expect(actual.entities[getAnnotationEntityId(mockGebiedsaanwijzingenEntity.annotationId)].data.vastgesteld).toEqual(
      mockGebiedsaanwijzingenEntity.vastgesteld
    );
  });
});
