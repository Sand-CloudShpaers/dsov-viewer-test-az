import { FilterIdentification } from '~viewer/filter/types/filter-options';

export class Documenttype implements FilterIdentification {
  public id: string;
  public name: string;
  public group?: string;
  public ozonValue?: string;
}
