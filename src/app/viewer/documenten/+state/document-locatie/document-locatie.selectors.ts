import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectDocumentenState, State } from '~viewer/documenten/+state';
import * as fromDocumentLocatie from './document-locatie.reducer';
import { Extent } from 'ol/extent';
import { extend } from 'ol/array';
import { BoundingBox } from '~ozon-model/boundingBox';

const getDocumentLocatieState = createSelector(selectDocumentenState, state => state[fromDocumentLocatie.featureKey]);

const { selectEntities: selectEntities } = fromDocumentLocatie.adapter.getSelectors(getDocumentLocatieState);

export const getExtent = (documentId: string): MemoizedSelector<State, Extent> =>
  createSelector(selectEntities, (documenten): Extent => {
    if (!documenten || !documenten[documentId]?.data) {
      return undefined;
    }
    let boundingBox: BoundingBox;

    const omvat = documenten[documentId]?.data?.omvat;
    if (omvat?.length) {
      const extent = [omvat[0].boundingBox];
      for (let i = 1; i < omvat.length; i++) {
        extend(extent, omvat[i].boundingBox);
      }
      boundingBox = extent[0];
    } else {
      boundingBox = documenten[documentId]?.data?.boundingBox;
    }
    return boundingBox ? [boundingBox.minx, boundingBox.miny, boundingBox.maxx, boundingBox.maxy] : undefined;
  });
