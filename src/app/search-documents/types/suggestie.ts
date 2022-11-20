import { Documenttype } from '~model/gegevenscatalogus/documenttype';
import { RegelingSuggestie } from '~ozon-model/regelingSuggestie';
import { TimeTravelDates } from '~model/time-travel-dates';

interface SuggestieSelectorData {
  id: RegelingSuggestie['identificatie'];
  type: RegelingSuggestie['type'];
  value: string;
  date: Date;
  timeTravelDates: TimeTravelDates;
}

export class SuggestieMap {
  citeerTitel?: RegelingSuggestie['citeerTitel'];
  identificatie?: RegelingSuggestie['identificatie'];
  bevoegdGezag?: RegelingSuggestie['bevoegdGezag'];
  type?: RegelingSuggestie['type'];
  geregistreerdMet?: RegelingSuggestie['geregistreerdMet'];

  constructor(data: RegelingSuggestie) {
    this.citeerTitel = data.citeerTitel;
    this.identificatie = data.identificatie;
    this.bevoegdGezag = data.bevoegdGezag;
    this.type = data.type;
    this.geregistreerdMet = data.geregistreerdMet;
  }

  getSelectorData(documentTypes: Documenttype[]): SuggestieSelectorData {
    return {
      id: this.identificatie,
      type: documentTypes.find(type => this.type === type.ozonValue)?.name,
      value: `${this.citeerTitel} -- ${this.identificatie}`,
      date: new Date(this.geregistreerdMet.beginInwerking),
      timeTravelDates: {
        beschikbaarOp: this.geregistreerdMet.tijdstipRegistratie,
        geldigOp: this.geregistreerdMet.beginGeldigheid,
        inWerkingOp: this.geregistreerdMet.beginInwerking,
      },
    };
  }
}
