import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';
import { commonRootKey } from '~store/common';
import { selectionFeatureKey } from '~store/common/selection/+state/selection.reducer';
import { TEST_IDENTIFICATIE } from '~viewer/gebieds-info/types/test-gebieds-info.model';
import { LoadingState } from '~model/loading-state.enum';
import { SelectionComponent } from './selection.component';
import { SelectionFacade } from './+state/selection.facade';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SelectionComponent', () => {
  let spectator: Spectator<SelectionComponent>;

  const initialState = {
    [commonRootKey]: {
      [selectionFeatureKey]: {
        ids: [TEST_IDENTIFICATIE],
        entities: {
          [TEST_IDENTIFICATIE]: {
            status: LoadingState.RESOLVED,
            entityId: TEST_IDENTIFICATIE,
            data: {
              id: TEST_IDENTIFICATIE,
              active: true,
            },
          },
        },
        error: null,
      },
    },
  } as any;

  const createComponent = createComponentFactory({
    component: SelectionComponent,
    declarations: [SelectionComponent],
    providers: [provideMockStore({ initialState }), SelectionFacade],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        identifier: TEST_IDENTIFICATIE,
        checked: false,
      },
    });
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
