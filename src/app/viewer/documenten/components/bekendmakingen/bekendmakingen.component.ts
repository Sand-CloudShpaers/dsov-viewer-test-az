import { Component, Input } from '@angular/core';
import { BekendmakingVM } from './bekendmakingen.model';

@Component({
  selector: 'dsov-bekendmakingen',
  templateUrl: './bekendmakingen.component.html',
  styleUrls: ['./bekendmakingen.component.scss'],
})
export class BekendmakingenComponent {
  @Input()
  public bekendmakingen: BekendmakingVM[] = [];

  public trackBy(_index: number, bekendmaking: { documentType: string; titel: string; href: string }): string {
    return bekendmaking.href;
  }
}
