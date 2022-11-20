import { Eenheid } from '~ozon-model/eenheid';
import { Normwaarde } from '~ozon-model/normwaarde';
import { OntwerpNormwaarde } from '~ozon-model/ontwerpNormwaarde';
import { Typenorm } from '~ozon-model/typenorm';

export interface NormVM {
  identificatie: string;
  naam: string;
  normwaarde: Array<Normwaarde | OntwerpNormwaarde>;
  type: Typenorm;
  groep: {
    code: string;
    waarde: string;
  };
  isOntwerp: boolean;
  eenheid?: Array<Eenheid>;
}
