import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { sortByKey } from '~general/utils/group-by.utils';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { ActiviteitenFacade } from '~viewer/overzicht/activiteiten/+state/activiteiten.facade';

@Component({
  selector: 'dsov-activiteiten-list-container',
  templateUrl: './activiteiten-list-container.component.html',
})
export class ActiviteitenListContainerComponent implements OnInit {
  public activeSelections$ = this.selectionFacade.getSelections$;
  public activiteitenStatus$ = this.activiteitenFacade.getActiviteitenStatus$;
  public activiteitenGroepen$ = this.activiteitenFacade.getActiviteitenGroepen$.pipe(
    map(groepen => sortByKey(groepen, 'waarde'))
  );

  constructor(private activiteitenFacade: ActiviteitenFacade, private selectionFacade: SelectionFacade) {}

  public ngOnInit(): void {
    this.activiteitenFacade.loadActiviteiten();
  }
}
