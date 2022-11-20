import { Norm } from '~ozon-model/norm';
import { Eenheid } from '~ozon-model/eenheid';
import { OntwerpNorm } from '~ozon-model/ontwerpNorm';

const eenheid: Eenheid = { code: 'm', waarde: '-4' };

export class NormFactory {
  public static createNorm(withEenheid = false): Norm {
    return {
      _links: {
        self: null,
      },
      identificatie: 'normId',
      naam: 'naam',
      eenheid: withEenheid ? [eenheid] : null,
      geregistreerdMet: {
        beginInwerking: '',
        beginGeldigheid: '',
        tijdstipRegistratie: '',
      },
      normwaarde: [
        {
          identificatie: 'normwaardeId',
          waardeInRegeltekst: 'veel waarde',
          _links: {
            self: { href: '' },
            geldtVoor: { href: '' },
          },
        },
      ],
      type: {
        code: 'code',
        waarde: 'waarde',
      },
    };
  }
  public static createOntwerpNorm(withEenheid = false): OntwerpNorm {
    return {
      identificatie: 'normId',
      naam: 'naam',
      eenheid: withEenheid ? [eenheid] : null,
      normwaarde: [
        {
          identificatie: 'normwaardeId',
          waardeInRegeltekst: 'veel waarde',
          geregistreerdMet: {
            versie: null,
            tijdstipRegistratie: null,
            eindRegistratie: null,
            status: null,
          },
          _links: {
            self: { href: '' },
          },
        },
      ],
      type: {
        code: 'code',
        waarde: 'waarde',
      },
      geregistreerdMet: {
        versie: null,
        tijdstipRegistratie: null,
        eindRegistratie: null,
        status: null,
      },
      _links: {
        self: null,
      },
    };
  }
}
