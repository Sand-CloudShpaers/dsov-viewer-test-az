import { initialState, reducer as documentStructuurReducer, State } from './document-structuur.reducer';
import { LoadingState } from '~model/loading-state.enum';
import * as DocumentStructuurActions from './document-structuur.actions';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { Tekst } from '~ihr-model/tekst';

describe('documentStructuurReducer', () => {
  const testId = 'testId';
  const testHref = 'testHref';
  const ihrEmptyState = {
    ids: [testId],
    entities: {
      [testId]: {
        status: LoadingState.PENDING,
        entityId: testId,
        data: {
          ozon: undefined,
          ihr: {},
        },
      },
    },
  } as State;
  it('should have initial state', () => {
    const action = {};
    const actual = documentStructuurReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should reset to initial state', () => {
    const action = DocumentStructuurActions.resetDocumentStructuur;
    const actual = documentStructuurReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should track loadstatus per selectedDocumentId', () => {
    const action = DocumentStructuurActions.loadOzonDocumentStructuur({ id: testId, href: testHref });
    const actual = documentStructuurReducer(initialState, action);

    expect(actual).toEqual({
      ids: [testId],
      entities: {
        testId: {
          status: LoadingState.PENDING,
          entityId: testId,
          error: undefined,
        },
      },
    } as State);
  });

  it('should add documentStructuren on loadSucces', () => {
    const action = DocumentStructuurActions.loadOzonDocumentStructuurSuccess({
      id: testId,
      data: {
        _embedded: { documentComponenten: [] },
        _links: null,
        page: {
          size: 0,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      },
    });
    const actual = documentStructuurReducer(initialState, action);

    expect(actual).toEqual({
      ids: [testId],
      entities: {
        testId: {
          status: LoadingState.RESOLVED,
          entityId: testId,
          data: {
            ozon: {
              _embedded: { documentComponenten: [] },
              _links: null,
              page: {
                size: 0,
                totalElements: 0,
                totalPages: 0,
                number: 0,
              },
            },
            ihr: undefined,
          },
        },
      },
    } as State);
  });

  it('should add documentStructuren on loadSucces for Ihr', () => {
    const stateBefore = {
      ids: [testId],
      entities: {
        testId: {
          status: LoadingState.RESOLVED,
          entityId: testId,
          data: {
            ihr: {
              regels: {
                id: 'regels',
                _embedded: {
                  children: [
                    {
                      id: 'regels.1',
                      _embedded: {
                        children: [
                          {
                            id: 'regels.1.1',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
            ozon: undefined as any,
          },
        },
      },
    };
    let action = DocumentStructuurActions.loadIhrDocumentStructuurSuccess({
      id: testId,
      data: {
        _embedded: {
          teksten: [
            {
              id: 'tekstId.1',
            } as Tekst,
          ],
        },
        _links: { next: { href: 'https://its.me?page=2' }, prev: { href: '' }, self: { href: 'https://its.me' } },
      },
      parentId: 'regels.1.1',
    });
    let actual = documentStructuurReducer(stateBefore as any, action);

    expect(actual).toEqual({
      ids: [testId],
      entities: {
        testId: {
          status: LoadingState.RESOLVED,
          entityId: testId,
          data: {
            ihr: {
              regels: {
                id: 'regels',
                _embedded: {
                  children: [
                    {
                      id: 'regels.1',
                      _embedded: {
                        children: [
                          {
                            id: 'regels.1.1',
                            _embedded: {
                              children: [
                                {
                                  id: 'tekstId.1',
                                } as Tekst,
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
            ozon: undefined as any,
          },
        },
      } as any,
    });

    action = DocumentStructuurActions.loadIhrDocumentStructuurSuccess({
      id: testId,
      data: {
        _embedded: {
          teksten: [
            {
              id: 'tekstId.2',
            } as Tekst,
          ],
        },
        _links: {
          next: { href: 'https://its.me?page=3' },
          prev: { href: '' },
          self: { href: 'https://its.me?page=2' },
        },
      },
      parentId: 'regels.1.1',
      addition: true,
    });
    actual = documentStructuurReducer(actual as any, action);

    expect(actual).toEqual({
      ids: [testId],
      entities: {
        testId: {
          status: LoadingState.RESOLVED,
          entityId: testId,
          data: {
            ihr: {
              regels: {
                id: 'regels',
                _embedded: {
                  children: [
                    {
                      id: 'regels.1',
                      _embedded: {
                        children: [
                          {
                            id: 'regels.1.1',
                            _embedded: {
                              children: [
                                {
                                  id: 'tekstId.1',
                                },
                                {
                                  id: 'tekstId.2',
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
            ozon: undefined as any,
          },
        },
      } as any,
    });
  });

  it('should track rejected documentStructuren', () => {
    const action = DocumentStructuurActions.loadDocumentStructuurFailure({ id: testId, error: null });
    const actual = documentStructuurReducer(initialState, action);

    expect(actual).toEqual({
      ids: [testId],
      entities: {
        testId: {
          status: LoadingState.REJECTED,
          entityId: testId,
          error: null,
        },
      },
    } as State);
  });

  it('should set loadingstate PENDING on loadIhrDocumentOnderdeel', () => {
    const action = DocumentStructuurActions.loadIhrDocumentOnderdeel({
      id: testId,
      subPage: {
        path: DocumentSubPagePath.INHOUD,
        label: 'Overig',
      },
    });
    const actual = documentStructuurReducer(ihrEmptyState, action);

    expect(actual).toEqual(ihrEmptyState as State);
  });

  it('should set loadingstate RESOLVED on loadIhrDocumentOnderdeelSuccess', () => {
    const action = DocumentStructuurActions.loadIhrDocumentOnderdeelSuccess({
      id: testId,
      documentSubPagePath: DocumentSubPagePath.INHOUD,
    });

    const actual = documentStructuurReducer(ihrEmptyState, action);

    expect(actual).toEqual({
      ids: [testId],
      entities: {
        testId: {
          status: LoadingState.RESOLVED,
          entityId: testId,
          data: {
            ozon: undefined,
            ihr: { inhoud: undefined },
          },
        },
      },
    } as State);
  });

  it('should set loadingstate REJECTED on loadDocumentStructuurFailure', () => {
    const action = DocumentStructuurActions.loadDocumentStructuurFailure({
      id: testId,
    });
    const actual = documentStructuurReducer(initialState, action);

    expect(actual).toEqual({
      ids: [testId],
      entities: {
        testId: {
          status: LoadingState.REJECTED,
          entityId: testId,
          error: undefined,
        },
      },
    } as State);
  });

  it('should set loadingstate ', () => {
    const action = DocumentStructuurActions.setLoadingState({
      id: testId,
      loadingState: LoadingState.RESOLVED,
    });
    const testState = {
      ids: [testId],
      entities: {
        testId: {
          status: LoadingState.PENDING,
          entityId: testId,
        },
      },
    } as State;

    const actual = documentStructuurReducer(testState, action);

    expect(actual).toEqual({
      ids: [testId],
      entities: {
        testId: {
          status: LoadingState.RESOLVED,
          entityId: testId,
        },
      },
    } as State);
  });

  it('should load IHR documentstructuur', () => {
    let actual = {
      ids: ['NL.IMRO.PT.regels.s3'],
      entities: {
        ['NL.IMRO.PT.regels.s3']: {
          status: LoadingState.RESOLVED,
          entityId: 'NL.IMRO.PT.regels.s3',
          data: {
            ozon: undefined,
            ihr: {
              regels: {
                externeReferentie: null,
                id: 'NL.IMRO.PT.regels.s3',
                inhoud: null,
                kruimelpad: [],
                titel: 'Regels',
                volgnummer: 2,
                _embedded: null,
                _links: null,
              },
            },
          },
        },
      },
    } as State;

    const child: Tekst = {
      id: 'NL.IMRO.PT.regels.s34',
      titel: 'Regels',
      inhoud: 'dit zijn regels',
      volgnummer: 1,
      kruimelpad: [],
      externeReferentie: null,
      _embedded: undefined,
      _links: undefined,
    };

    const action = DocumentStructuurActions.loadIhrDocumentStructuurSuccess({
      id: 'NL.IMRO.PT.regels.s3',
      parentId: 'NL.IMRO.PT.regels.s3',
      data: { _embedded: { teksten: [child] }, _links: undefined },
    });
    actual = documentStructuurReducer(actual, action);

    expect(actual.entities['NL.IMRO.PT.regels.s3'].data.ihr.regels._embedded).toEqual({ children: [child] });
  });
});
