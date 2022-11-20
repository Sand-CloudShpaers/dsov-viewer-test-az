import { FilterIdentification } from '~viewer/filter/types/filter-options';

export class PlanType implements FilterIdentification {
  public id: string;
  public name: string;
  public group?: string;
  public service: string | null;
}
