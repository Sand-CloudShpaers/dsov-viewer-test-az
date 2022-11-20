import { Normwaarde } from '~ozon-model/normwaarde';
import { OntwerpNormwaarde } from '~ozon-model/ontwerpNormwaarde';
import { NormVM } from '../types/norm';

export const getDescription = (normwaarde: Normwaarde | OntwerpNormwaarde, norm: NormVM): string => {
  if (normwaarde.waardeInRegeltekst) {
    return normwaarde.waardeInRegeltekst;
  } else if (normwaarde.kwalitatieveWaarde) {
    return normwaarde.kwalitatieveWaarde;
  }
  return `${normwaarde.kwantitatieveWaarde} ${norm.eenheid ? norm.eenheid[0]?.waarde : ''}`;
};
