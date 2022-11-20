import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { LoadMoreComponent } from './load-more.component';
import { MockComponent } from 'ng-mocks';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoadMoreComponent', () => {
  let spectator: Spectator<LoadMoreComponent>;

  const createComponent = createComponentFactory({
    component: LoadMoreComponent,
    declarations: [MockComponent(LoadMoreComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
