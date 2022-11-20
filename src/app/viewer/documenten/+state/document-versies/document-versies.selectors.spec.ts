import { createRegelingMock } from '~mocks/documenten.mock';
import { LoadingState } from '~model/loading-state.enum';
import * as fromSelectors from './document-versies.selectors';

describe('DocumentVersiesSelectors', () => {
  it('should return empty list', () => {
    expect(
      fromSelectors.getVastgesteldVersies().projector({
        vastgesteld: {
          regelingen: [],
          status: LoadingState.RESOLVED,
        },
      })
    ).toEqual([]);
  });

  it('should return list', () => {
    expect(
      fromSelectors.getVastgesteldVersies().projector({
        vastgesteld: {
          regelingen: [createRegelingMock(), createRegelingMock()],
          status: LoadingState.RESOLVED,
        },
      })
    ).toEqual([
      {
        identificatie: '/akn/nl/act/test',
        versie: 1,
        geldigOp: { original: '2022-02-02', date: new Date('2022-02-02') },
        inWerkingOp: { original: '2022-02-02', date: new Date('2022-02-02') },
        beschikbaarOp: { original: '2022-09-08T11:15:00.201566Z', date: new Date('2022-09-08T11:15:00.201566Z') },
        gepubliceerdOp: { original: '2022-09-08T11:15:00.201566Z', date: new Date('2022-09-08T11:15:00.201566Z') },
      },
      {
        identificatie: '/akn/nl/act/test',
        versie: 1,
        geldigOp: { original: '2022-02-02', date: new Date('2022-02-02') },
        inWerkingOp: { original: '2022-02-02', date: new Date('2022-02-02') },
        beschikbaarOp: { original: '2022-09-08T11:15:00.201566Z', date: new Date('2022-09-08T11:15:00.201566Z') },
        gepubliceerdOp: { original: '2022-09-08T11:15:00.201566Z', date: new Date('2022-09-08T11:15:00.201566Z') },
      },
    ]);
  });
});
