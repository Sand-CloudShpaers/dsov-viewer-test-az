import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Thema } from '~ozon-model/thema';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { HoofdlijnVM } from '~viewer/documenten/+state/hoofdlijnen/hoofdlijnen.model';
import { DocumentDto } from '~viewer/documenten/types/documentDto';

@Component({
  selector: 'dsov-inhoud-ozon',
  templateUrl: './inhoud-ozon.component.html',
  styleUrls: ['./inhoud-ozon.component.scss'],
})
export class InhoudOzonComponent implements OnInit {
  @Input() public document: DocumentDto;

  public themas$: Observable<Thema[]>;
  public themasStatus$ = this.documentenFacade.themasStatus$;
  public hoofdlijnen$: Observable<Record<string, HoofdlijnVM[]>>;
  public hoofdlijnenStatus$ = this.documentenFacade.hoofdlijnenStatus$;

  public accordion = {
    thema: false,
    hoofdlijnen: false,
    index: true,
  };

  constructor(private documentenFacade: DocumentenFacade) {}

  public ngOnInit(): void {
    this.documentenFacade.loadThemas(this.document);
    this.themas$ = this.documentenFacade.sortedThemasByDocumentId$(this.document?.documentId);
    this.documentenFacade.loadHoofdlijnen(this.document);
    this.hoofdlijnen$ = this.documentenFacade.getHoofdlijnenByDocumentId$(this.document?.documentId);
  }

  public hasHoofdlijnen = (hoofdlijnen: Record<string, Array<HoofdlijnVM>>): boolean =>
    !!Object.keys(hoofdlijnen).length;
}
