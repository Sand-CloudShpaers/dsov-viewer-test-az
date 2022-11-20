import { initialState, reducer } from './document-element-link.reducer';
import { storeDocumentElementLink } from '~viewer/documenten/+state/document-element-link/document-element-link.actions';

describe('documentElementLinkReducer', () => {
  let actual;
  it('should have initial state', () => {
    const action = {};
    actual = reducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add an elementLink on storeDocumentElementLink', () => {
    const action = storeDocumentElementLink({
      documentId: 'documentId',
      elementId: 'elementId',
    });
    actual = reducer(initialState, action);

    expect(actual.interneLinkProperties.documentId).toEqual('documentId');
    expect(actual.interneLinkProperties.elementId).toEqual('elementId');
  });
});
