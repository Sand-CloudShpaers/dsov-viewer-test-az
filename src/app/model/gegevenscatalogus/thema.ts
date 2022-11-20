import { FilterIdentification } from '~viewer/filter/types/filter-options';

export class Thema implements FilterIdentification {
  public id: string;
  public name: string;
  public group?: string;
  public icon?: string;
  public default?: boolean;
}
