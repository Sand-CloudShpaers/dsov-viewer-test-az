import { initialState, reducer as divisieannotatieReducer } from './divisieannotatie.reducer';
import { loadDivisieannotatieSuccess } from '~viewer/documenten/+state/divisieannotatie/divisieannotatie.actions';

describe('divisieannotatieReducer', () => {
  let actual;
  it('should have initial state', () => {
    const action = {};
    actual = divisieannotatieReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add a divisieannotatie on loadDivisieannotatieSuccess', () => {
    const action = loadDivisieannotatieSuccess({
      documentstructuurelementId: 'documentId',
      vastgesteld: {
        identificatie: 'blub123',
        documentIdentificatie: 'documentId',
        geregistreerdMet: {
          beginInwerking: '',
          beginGeldigheid: '',
          tijdstipRegistratie: '',
        },
        _links: {
          omschrijving: { href: '' },
          self: { href: '' },
          isVrijetekstannotatieBij: { href: '' },
        },
      },
    });
    actual = divisieannotatieReducer(initialState, action);

    expect(actual.ids).toEqual(['blub123']);
  });
});
