import { initialState, reducer as regeltekstReducer } from './regeltekst.reducer';
import {
  loadRegelteksten,
  loadRegeltekstenSuccess,
  loadRegeltekstSuccess,
} from '~viewer/documenten/+state/regeltekst/regeltekst.actions';
import { mockOntwerpRegelTekst, mockRegelTekst } from '~mocks/ozon/regeltekst-factory';

describe('regeltekstReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = regeltekstReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should remove all', () => {
    const actual = regeltekstReducer(undefined, loadRegelteksten as any);

    expect(actual).toEqual(initialState);
  });

  it('should add regeltekst on loadRegeltekstSuccess', () => {
    const action = loadRegeltekstSuccess({
      documentstructuurelementId: 'testDocumentstructuurelementId',
      vastgesteld: mockRegelTekst(),
      ontwerp: undefined,
    });
    const actual = regeltekstReducer(initialState, action);

    expect(actual.ids).toEqual([mockRegelTekst().identificatie]);
  });

  it('should add ontwerpRegeltekst on loadRegeltekstSuccess', () => {
    const action = loadRegeltekstSuccess({
      documentstructuurelementId: 'testDocumentstructuurelementId',
      vastgesteld: undefined,
      ontwerp: mockOntwerpRegelTekst(),
    });
    const actual = regeltekstReducer(initialState, action);

    expect(actual.ids).toEqual([mockOntwerpRegelTekst().technischId]);
  });

  it('should add regelteksten on loadRegeltekstenSuccess (vastgesteld)', () => {
    const action = loadRegeltekstenSuccess({
      id: '',
      vastgesteld: [mockRegelTekst()],
      ontwerp: [],
    });
    const actual = regeltekstReducer(initialState, action);

    expect(actual.entities).toEqual({
      [mockRegelTekst().identificatie]: {
        id: mockRegelTekst().identificatie,
        documentIdentificatie: mockRegelTekst().documentIdentificatie,
        vastgesteld: mockRegelTekst(),
      },
    });
  });

  it('should add regelteksten on loadRegeltekstenSuccess (ontwerp)', () => {
    const action = loadRegeltekstenSuccess({
      id: '',
      vastgesteld: [],
      ontwerp: [mockOntwerpRegelTekst()],
    });
    const actual = regeltekstReducer(initialState, action);

    expect(actual.entities).toEqual({
      [mockOntwerpRegelTekst().technischId]: {
        id: mockOntwerpRegelTekst().technischId,
        documentIdentificatie: mockOntwerpRegelTekst().documentTechnischId,
        ontwerp: mockOntwerpRegelTekst(),
      },
    });
  });

  it('should return state on loadRegeltekstenSuccess (none)', () => {
    const action = loadRegeltekstenSuccess({
      id: '',
      vastgesteld: [],
      ontwerp: [],
    });
    const actual = regeltekstReducer(initialState, action);

    expect(actual).toEqual(initialState);
  });
});
