import { IhrRegelStatus, RegelStatus } from '~model/regel-status.model';

export function mapIhrStatusToRegelStatus(status: string): RegelStatus {
  switch (status) {
    case IhrRegelStatus.Ontwerp:
      return RegelStatus.InVoorbereiding;
    case IhrRegelStatus.Vastgesteld:
    default:
      return RegelStatus.Geldend;
  }
}

export function mapRegelStatusToIhrRegelStatus(regelStatus: RegelStatus): IhrRegelStatus {
  switch (regelStatus) {
    case RegelStatus.Geldend:
      return IhrRegelStatus.Vastgesteld;
    case RegelStatus.InVoorbereiding:
      return IhrRegelStatus.Ontwerp;
  }
}
