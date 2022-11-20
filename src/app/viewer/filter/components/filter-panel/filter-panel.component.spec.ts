import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilterName } from '~viewer/filter/types/filter-options';
import {
  FilterConfirmationComponent,
  FilterConfirmationOptions,
} from '../filter-confirmation/filter-confirmation.component';
import { FilterContentComponent } from '../filter-content/filter-content.component';
import { FilterPanelComponent } from './filter-panel.component';

const options: FilterConfirmationOptions = {
  name: FilterName.ACTIVITEIT,
  title: 'Uw gekozen gebieden worden verwijderd',
  message:
    "U kunt niet tegelijkertijd zoeken op gebieden/thema's en op activiteiten. Als u Activiteiten gaat bekijken worden uw gekozen gebieden/thema's verwijderd.",
  toBeDeletedFilter: FilterName.GEBIEDEN,
  page: ViewerPage.ACTIVITEITEN,
};

describe('FilterPanelComponent', () => {
  let spectator: Spectator<FilterPanelComponent>;
  const spyOnHideFilterPanel = jasmine.createSpy('spyOnHideFilterPanel');

  const createComponent = createComponentFactory({
    component: FilterPanelComponent,
    imports: [],
    providers: [
      mockProvider(FilterFacade, {
        hideFilterPanel: spyOnHideFilterPanel,
      }),
    ],
    declarations: [MockComponent(FilterConfirmationComponent), MockComponent(FilterContentComponent)],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.component.filterConfirmationComponent = new FilterConfirmationComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('close', () => {
    it('should close panel', () => {
      spectator.component.close();

      expect(spyOnHideFilterPanel).toHaveBeenCalled();
    });
  });

  describe('confirm', () => {
    it('should call confirm panel', () => {
      spyOn(spectator.component.filterConfirmationComponent, 'confirm');
      spectator.component.confirm(options);

      expect(spectator.component.filterConfirmationComponent.confirm).toHaveBeenCalledWith(options);
    });
  });
});
