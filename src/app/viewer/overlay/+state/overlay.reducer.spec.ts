import * as DocumentElementLinkActions from '~viewer/documenten/+state/document-element-link/document-element-link.actions';
import * as DocumentTekstenPlanobjectActions from '~viewer/documenten/+state/document-teksten-planobject/document-teksten-planobject.actions';
import { initialState, reducer as overlayReducer, State } from './overlay.reducer';
import * as OverlayActions from './overlay.actions';

describe('overlayReducer', () => {
  const documentElementLinkState: State = {
    ...initialState,
    documentId: 'documentId',
    content: '<span></span>',
    element: undefined,
    title: 'title',
    subtitle: 'subtitle',
    loadingStatus: null,
    showInterneLinkContainer: true,
  } as State;

  const documentTekstenPlanobjectState: State = {
    ...initialState,
    content: '<span></span>',
    title: 'title',
    subtitle: 'subtitle',
    loadingStatus: null,
    showDocumentTeksten: true,
  } as State;

  it('should have initial state', () => {
    const action = {};
    const actual = overlayReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should have document internal link state, when showDocumentTekstenResult', () => {
    const action = DocumentTekstenPlanobjectActions.showDocumentTekstenResult({
      content: '<span></span>',
      title: 'title',
      subtitle: 'subtitle',
      loadingStatus: null,
    });
    const actual = overlayReducer(initialState, action);

    expect(actual).toEqual(documentTekstenPlanobjectState);
  });

  it('should have document internal link state, when showDocumentElementLinkResult', () => {
    const action = DocumentElementLinkActions.showDocumentElementLinkResult({
      documentId: 'documentId',
      content: '<span></span>',
      title: 'title',
      subtitle: 'subtitle',
      loadingStatus: null,
    });
    const actual = overlayReducer(initialState, action);

    expect(actual).toEqual(documentElementLinkState);
  });

  it('should have application info state', () => {
    const action = OverlayActions.showApplicationInfo();
    const actual = overlayReducer(initialState, action);

    expect(actual).toEqual({ ...initialState, showApplicationInfo: true });
  });

  it('should have help state', () => {
    const action = OverlayActions.showHelp();
    const actual = overlayReducer(initialState, action);

    expect(actual).toEqual({ ...initialState, showHelp: true });
  });

  it('should have initial state, when close', () => {
    const action = OverlayActions.closeOverlay();
    const actual = overlayReducer(documentElementLinkState, action);

    expect(actual).toEqual(initialState);
  });
});
