import { Component, Input } from '@angular/core';

@Component({
  selector: 'dsov-cms-content',
  templateUrl: './cms-content.component.html',
})
export class CmsContentComponent {
  @Input() public content: string;
}
