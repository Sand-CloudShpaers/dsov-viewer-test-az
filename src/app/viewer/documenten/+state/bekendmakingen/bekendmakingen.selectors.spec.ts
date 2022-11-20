import { BekendmakingCollectie } from '~ihr-model/bekendmakingCollectie';
import * as fromSelectors from '~viewer/documenten/+state/bekendmakingen/bekendmakingen.selectors';

const id = 'NL.IMRO.plan-met-bekendmakingen';

export const bekendmakingenMock: BekendmakingCollectie = {
  bekendmakingen: [
    {
      documentType: 'Staatscourant',
      titel: 'Gepubliceerd plan',
      href: 'link naar publicatie',
    },
    {
      documentType: 'Gemeenteblad',
      titel: 'Gepubliceerd gemeente plan',
      href: 'link naar publicatie in gemeenteblad',
    },
  ],
};

export const emptyBekendmakingenMock: BekendmakingCollectie = {
  bekendmakingen: [],
};

describe('Bekendmakingen Selectors', () => {
  it('should return bekendmakingen for plan with selectedDocumentId', () => {
    expect(
      fromSelectors.selectBekendmakingenByDocumentId(id).projector({
        'NL.IMRO.plan-met-bekendmakingen': {
          data: bekendmakingenMock,
          entityId: id,
          status: 'RESOLVED',
        },
      })
    ).toEqual(bekendmakingenMock.bekendmakingen);
  });
});
