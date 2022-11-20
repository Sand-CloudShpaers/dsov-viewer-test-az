import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { ActiviteitenListComponent } from './activiteiten-list.component';
import { mockActiviteitenGroepVM, mockActiviteitenVM } from '../../+state/activiteiten.mock';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { ApiSource } from '~model/internal/api-source';
import { SelectionObjectType } from '~store/common/selection/selection.model';

describe('ActiviteitenListComponent', () => {
  let spectator: Spectator<ActiviteitenListComponent>;
  const spyOnToggleAddSelections = jasmine.createSpy('spyOnToggleAddSelections');

  const createComponent = createComponentFactory({
    imports: [RouterTestingModule],
    component: ActiviteitenListComponent,
    providers: [mockProvider(FilterFacade), mockProvider(SelectionFacade, { addSelections: spyOnToggleAddSelections })],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        activeSelections: [],
        activiteitenGroepen: [mockActiviteitenGroepVM],
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should get description, with one activiteit', () => {
    spectator.setInput({
      activeSelections: [
        {
          id: mockActiviteitenVM[0].identificatie,
          apiSource: ApiSource.OZON,
          objectType: SelectionObjectType.GEBIEDSAANWIJZING,
          name: 'mockje',
        },
      ],
    });
    spectator.detectComponentChanges();

    expect(spectator.component.getDescription()).toEqual('1 activiteit geselecteerd');
  });

  it('should get description, with multiple activiteiten', () => {
    spectator.setInput({
      activeSelections: [
        {
          id: mockActiviteitenVM[0].identificatie,
          apiSource: ApiSource.OZON,
          objectType: SelectionObjectType.GEBIEDSAANWIJZING,
          name: 'mockje',
        },
        {
          id: mockActiviteitenVM[1].identificatie,
          apiSource: ApiSource.OZON,
          objectType: SelectionObjectType.REGELTEKST_ACTIVITEITLOCATIEAANDUIDING,
          name: 'mockje',
        },
      ],
    });
    spectator.detectComponentChanges();

    expect(spectator.component.getDescription()).toEqual(mockActiviteitenVM.length + ' activiteiten geselecteerd');
  });

  it('should get description, with NO selected AND 1 activiteit', () => {
    spectator.component.activiteiten = [mockActiviteitenVM[0]];
    spectator.detectComponentChanges();

    expect(spectator.component.getDescription()).toEqual('1 activiteit');
  });

  it('should get description, with NO selected AND multiple activiteiten', () => {
    spectator.component.activiteiten = mockActiviteitenVM;
    spectator.detectComponentChanges();

    expect(spectator.component.getDescription()).toEqual('2 activiteiten');
  });

  it('should get group is open', () => {
    spectator.setInput({
      activeSelections: [
        {
          id: mockActiviteitenVM[0].identificatie,
          apiSource: ApiSource.OZON,
          objectType: SelectionObjectType.GEBIEDSAANWIJZING,
          name: 'mockje',
        },
      ],
    });
    spectator.detectComponentChanges();

    expect(spectator.component.getGroupIsOpen(mockActiviteitenGroepVM)).toBeTrue();
  });

  it('should return title', () => {
    expect(spectator.component.getTitle(mockActiviteitenGroepVM)).toEqual('Dagje uit');
  });

  it('should toggleGroep', () => {
    spectator.component.onToggleGroep(mockActiviteitenGroepVM.code);

    expect(spectator.component.openGroepen).toEqual([mockActiviteitenGroepVM.code]);
  });

  it('should toggleChecked', () => {
    spectator.component.onToggleCheckbox(mockActiviteitenVM[0], { target: { checked: true } } as unknown as Event);

    expect(spyOnToggleAddSelections).toHaveBeenCalledWith([
      {
        id: mockActiviteitenVM[0].identificatie,
        name: mockActiviteitenVM[0].naam,
        objectType: SelectionObjectType.ACTIVITEIT,
        apiSource: ApiSource.OZON,
      },
    ]);
  });

  describe('trackByFn', () => {
    it('should track by activiteit', () => {
      expect(spectator.component.trackByActiviteit(0, mockActiviteitenVM[0])).toEqual(
        mockActiviteitenVM[0].identificatie
      );
    });

    it('should track by group', () => {
      expect(spectator.component.trackByGroep(0, mockActiviteitenGroepVM)).toEqual(mockActiviteitenGroepVM.code);
    });
  });
});
