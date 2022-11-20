import * as fromSelectors from './gebiedsaanwijzingen.selectors';
import {
  mockbeperkingsgebieden,
  mockGebiedsaanwijzingenResponse,
  mockGebiedsaanwijzingenVM,
} from './gebiedsaanwijzingen.mock';
import * as fromGebiedsaanwijzingen from './gebiedsaanwijzingen.reducer';

describe('GebiedsaanwijzingenSelectors', () => {
  it('selectGebiedsaanwijzingenVM', () => {
    expect(
      fromSelectors.selectGebiedsaanwijzingenVM.projector([
        { entityId: fromGebiedsaanwijzingen.entityId, data: mockGebiedsaanwijzingenResponse._embedded },
      ])
    ).toEqual([mockGebiedsaanwijzingenVM]);
  });

  it('selectGebiedsaanwijzingenForOverzichtVM', () => {
    const gebied = mockbeperkingsgebieden;

    expect(
      fromSelectors.selectGebiedsaanwijzingenForOverzichtVM.projector([
        { entityId: fromGebiedsaanwijzingen.entityId, data: mockGebiedsaanwijzingenResponse._embedded },
      ])
    ).toEqual([
      {
        identificatie: gebied[0].identificatie,
        naam: gebied[0].naam,
        href: '/gebiedsaanwijzingen/identificatie/locatietiles',
        groep: gebied[0].groep.waarde,
        type: 'Beperkingengebieden',
        isSelected: false,
        symboolcode: undefined,
      },
    ]);
  });
});
