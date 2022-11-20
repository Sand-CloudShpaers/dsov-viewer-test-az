import * as fromSelectors from './document.selectors';
import { LoadingState } from '~model/loading-state.enum';
import { derivedLoadingState } from '~general/utils/store.utils';

describe('DocumentSelectors', () => {
  describe('selectRegelsOpMaatDocumentStatus', () => {
    it('should return loading state', () => {
      expect(
        fromSelectors
          .selectDocumentStatus('documentId')
          .projector({ ['documentId']: { status: LoadingState.RESOLVED } })
      ).toEqual(derivedLoadingState(LoadingState.RESOLVED));
    });
  });

  describe('selectRegelsOpMaatDocumentenIds', () => {
    it('should return document ids', () => {
      expect(
        fromSelectors.selectDocumentIds.projector([
          {
            entityId: 'documentId',
            data: { documentId: 'documentId' },
          },
          {
            entityId: 'documentId',
            data: { documentId: 'documentId' },
          },
        ])
      ).toEqual(['documentId', 'documentId']);
    });
  });
});
