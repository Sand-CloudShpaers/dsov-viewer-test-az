import { GerelateerdePlannenComponent } from './gerelateerde-plannen.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import {
  gerelateerdePlannenDocumentVMMock,
  gerelateerdePlannenDocumentVMVerwijderdMock,
} from '~viewer/documenten/+state/gerelateerde-plannen/gerelateerde-plannen.selectors.spec';
import { Router } from '@angular/router';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PipesModule } from '~general/pipes/pipes.module';

describe('GerelateerdePlannenComponent', () => {
  let spectator: Spectator<GerelateerdePlannenComponent>;
  let spectatorVerwijderdPlan: Spectator<GerelateerdePlannenComponent>;
  const spyOnSetNavigationPath = jasmine.createSpy('spyOnSetNavigationPath');
  const spyOnNavigate = jasmine.createSpy('spyOnNavigate');

  const createComponent = createComponentFactory({
    component: GerelateerdePlannenComponent,
    providers: [
      mockProvider(NavigationFacade, {
        setNavigationPath: spyOnSetNavigationPath,
      }),
      mockProvider(Router, {
        navigate: spyOnNavigate,
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [PipesModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        documenten: gerelateerdePlannenDocumentVMMock,
      },
    });
    spectator.detectComponentChanges();

    spectatorVerwijderdPlan = createComponent({
      props: {
        documenten: gerelateerdePlannenDocumentVMVerwijderdMock,
      },
    });
    spectatorVerwijderdPlan.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show gerelateerdeplannen', () => {
    expect(spectator.queryAll('[data-test-id="gerelateerdplan__title"]')[0]).toHaveText('LeukPlan');
    expect(spectator.queryAll('[data-test-id="gerelateerdplan__type"]')[0]).toHaveText('Bestemmingsplan');
  });

  it('should call setNavigationPath and navigate', () => {
    spectator.component.openDocument('NL.IMRO.gerelateerd-plan');

    expect(spyOnSetNavigationPath).toHaveBeenCalled();
    expect(spyOnNavigate).toHaveBeenCalledWith(
      [`${ApplicationPage.VIEWER}/${ViewerPage.DOCUMENT}/NL.IMRO.gerelateerd-plan`],
      { queryParamsHandling: 'preserve' }
    );
  });

  it('should show historisch badge', () => {
    expect(spectator.queryAll('[data-test-id="summary__badge-ishistorisch"]')).toHaveText('Historisch');
  });

  it('should show verwijderdOp badge, precedence over Historisch badge', () => {
    expect(spectatorVerwijderdPlan.queryAll('[data-test-id="summary__badge-isVerwijderdOp"]')).toHaveText('Verwijderd');
    expect(spectatorVerwijderdPlan.queryAll('[data-test-id="summary__badge-ishistorisch"]')).not.toExist();
  });

  it('should show eindeRechtsgeldigheid badge', () => {
    expect(spectatorVerwijderdPlan.queryAll('[data-test-id="summary__badge-eindeRechtsgeldigheid"]')).toHaveText(
      'Plan is niet meer rechtsgeldig per 01-01-2020'
    );
  });
});
