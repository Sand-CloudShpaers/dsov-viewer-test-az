import {
  mapIhrStatusToRegelStatus,
  mapRegelStatusToIhrRegelStatus,
} from '~viewer/filtered-results/helpers/regelstatus';
import { IhrRegelStatus, RegelStatus } from '~model/regel-status.model';

describe('regelstatus helper', () => {
  it('should mapIhrStatusToRegelStatus', () => {
    expect(mapIhrStatusToRegelStatus(IhrRegelStatus.Ontwerp)).toBe(RegelStatus.InVoorbereiding);
    expect(mapIhrStatusToRegelStatus(IhrRegelStatus.Vastgesteld)).toBe(RegelStatus.Geldend);
    expect(mapIhrStatusToRegelStatus('' as IhrRegelStatus)).toBe(RegelStatus.Geldend);
  });

  it('should mapRegelStatusToIhrRegelStatus', () => {
    expect(mapRegelStatusToIhrRegelStatus(RegelStatus.Geldend)).toEqual(IhrRegelStatus.Vastgesteld);
    expect(mapRegelStatusToIhrRegelStatus(RegelStatus.InVoorbereiding)).toEqual(IhrRegelStatus.Ontwerp);
  });
});
