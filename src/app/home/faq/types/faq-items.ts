import { Observable } from 'rxjs';

export interface FaqItem {
  content: string;
  open?: boolean;
  title: string;
}

export interface FaqInfo {
  leadIn$: Observable<FaqItem>;
  questions$: Observable<FaqItem[]>;
}

export interface FaqJson {
  hasMoreItems: boolean;
  numItems: number;
  objects: FaqJsonObject[];
}

export interface FaqJsonObject {
  object: {
    properties: {
      'cmis:objectTypeId': Record<string, string>;
      'dso:Tit': Record<string, string>;
      'dso:Inhoud/Inleiding': Record<string, string>;
      'dso:Inhoud/Antwoord': Record<string, string>;
    };
  };
}
