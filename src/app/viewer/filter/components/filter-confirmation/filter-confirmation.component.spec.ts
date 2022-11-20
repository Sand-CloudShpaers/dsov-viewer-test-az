import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { FilterName } from '~viewer/filter/types/filter-options';
import { FilterConfirmationComponent, FilterConfirmationOptions } from './filter-confirmation.component';

describe('FilterConfirmationComponent', () => {
  let spectator: Spectator<FilterConfirmationComponent>;

  const createComponent = createComponentFactory({
    component: FilterConfirmationComponent,
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should set confirm data', () => {
    const options: FilterConfirmationOptions = {
      name: FilterName.ACTIVITEIT,
      title: 'title',
      message: 'message',
      toBeDeletedFilter: FilterName.GEBIEDEN,
      page: ViewerPage.THEMAS,
    };
    spectator.component.confirm(options);

    expect(spectator.component.options).toEqual(options);
    expect(spectator.component.show).toBeTrue();
  });

  it('should approve', () => {
    spyOn(spectator.component.approved, 'emit');
    const options: FilterConfirmationOptions = {
      name: FilterName.ACTIVITEIT,
      title: '',
      message: '',
      toBeDeletedFilter: FilterName.GEBIEDEN,
      page: ViewerPage.THEMAS,
    };
    spectator.component.options = options;
    spectator.component.approve();

    expect(spectator.component.approved.emit).toHaveBeenCalledWith(options);

    expect(spectator.component.show).toBeFalse();
  });

  it('should cancel', () => {
    spyOn(spectator.component.canceled, 'emit');
    const options: FilterConfirmationOptions = {
      name: FilterName.ACTIVITEIT,
      title: '',
      message: '',
      toBeDeletedFilter: FilterName.GEBIEDEN,
      page: ViewerPage.THEMAS,
    };
    spectator.component.options = options;

    spectator.component.cancel();

    expect(spectator.component.canceled.emit).toHaveBeenCalled();

    expect(spectator.component.show).toBeFalse();
  });

  it('should open', () => {
    spectator.component.open();

    expect(spectator.component.show).toBeTrue();
  });

  it('should close', () => {
    spectator.component.close();

    expect(spectator.component.show).toBeFalse();
  });
});
