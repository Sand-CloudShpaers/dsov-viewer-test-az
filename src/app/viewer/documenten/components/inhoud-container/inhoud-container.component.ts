import { Component, Input } from '@angular/core';
import { ApiUtils } from '~general/utils/api.utils';
import { DocumentDto } from '~viewer/documenten/types/documentDto';

@Component({
  selector: 'dsov-inhoud-container',
  templateUrl: './inhoud-container.component.html',
  styleUrls: ['./inhoud-container.component.scss'],
})
export class InhoudContainerComponent {
  @Input() public document: DocumentDto;

  public ApiUtils = ApiUtils;
}
