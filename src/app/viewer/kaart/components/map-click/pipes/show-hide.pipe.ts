import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showHide',
})
export class ShowHidePipe implements PipeTransform {
  public transform(value: boolean): 'show' | 'hide' {
    return value ? 'show' : 'hide';
  }
}
