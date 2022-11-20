import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadMoreLinks } from '~viewer/regels-op-maat/types/load-more-links';
import { DerivedLoadingState } from '~general/utils/store.utils';

@Component({
  selector: 'dsov-load-more',
  templateUrl: './load-more.component.html',
  styleUrls: ['./load-more.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadMoreComponent {
  @Input()
  public loadMoreLinks: LoadMoreLinks;

  @Input()
  public loadMoreStatus: DerivedLoadingState;

  @Output()
  public doLoadMore = new EventEmitter<void>();

  public loadMore(): void {
    this.doLoadMore.emit();
  }

  public hasLoadMoreLinks(): boolean {
    return (
      !!this.loadMoreLinks?.vastgesteld?.regelteksten?.href ||
      !!this.loadMoreLinks?.vastgesteld?.divisieannotaties?.href ||
      !!this.loadMoreLinks?.vastgesteld?.teksten?.href ||
      !!this.loadMoreLinks?.ontwerp?.regeltekstenVastgesteldeLocaties?.href ||
      !!this.loadMoreLinks?.ontwerp?.regeltekstenOntwerpLocaties?.href ||
      !!this.loadMoreLinks?.ontwerp?.divisieannotatiesVastgesteldeLocaties?.href ||
      !!this.loadMoreLinks?.ontwerp?.divisieannotatiesOntwerpLocaties?.href
    );
  }
}
