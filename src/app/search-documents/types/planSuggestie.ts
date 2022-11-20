import { formattedDate } from '~general/utils/date.utils';
import { PlanSuggestie } from '~ihr-model/planSuggestie';

interface PlanSuggestieSelectorData {
  id: PlanSuggestie['id'];
  type: PlanSuggestie['type'];
  value: string;
  date: Date;
}

export class PlanSuggestieMap {
  id: PlanSuggestie['id'];
  type: PlanSuggestie['type'];
  naam: PlanSuggestie['naam'];
  planstatusInfo: PlanSuggestie['planstatusInfo'];
  dossier: PlanSuggestie['dossier'];

  constructor(data: PlanSuggestie) {
    this.id = data.id;
    this.type = data.type;
    this.naam = data.naam;
    this.planstatusInfo = data.planstatusInfo;
    this.dossier = data.dossier;
  }

  public getSelectorData(): PlanSuggestieSelectorData {
    return {
      id: this.id,
      type: this.type,
      value: `${this.naam} - ${this.planstatusInfo.planstatus} ${formattedDate(this.planstatusInfo.datum)} ${
        this.dossier?.status
      } ${this.id}`,
      date: new Date(this.planstatusInfo.datum),
    };
  }
}
