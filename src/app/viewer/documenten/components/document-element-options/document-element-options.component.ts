import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DocumentBodyElement } from '~viewer/documenten/types/documenten.model';

@Component({
  selector: 'dsov-document-element-options',
  templateUrl: './document-element-options.component.html',
  styleUrls: ['./document-element-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentElementOptionsComponent {
  @Input() public structuurelement: DocumentBodyElement;
}
