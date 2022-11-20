import { Normwaarde } from '~ozon-model/normwaarde';
import { NormVM } from '../types/norm';
import { getDescription } from './normwaarden';

describe('getDescription', () => {
  it('should return waardeInRegelTekst', () => {
    expect(getDescription({ waardeInRegeltekst: 'a' } as Normwaarde, undefined)).toEqual('a');
  });

  it('should return kwalitatieveWaarde', () => {
    expect(getDescription({ kwalitatieveWaarde: 'a' } as Normwaarde, undefined)).toEqual('a');
  });

  it('should return kwantitatieveWaarde en eenheid', () => {
    expect(
      getDescription(
        { kwantitatieveWaarde: 1, identificatie: '', _links: null } as Normwaarde,
        { eenheid: [{ waarde: 'b' }] } as NormVM
      )
    ).toEqual('1 b');
  });
});
