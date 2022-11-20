import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import {
  activiteitLocatieaanduidingenGroepVM,
  mockAanduidingLocatiesVM,
} from '~viewer/overzicht/activiteiten/+state/activiteiten.mock';
import { ActiviteitenComponent } from './activiteiten.component';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { of } from 'rxjs';
import { AnnotatiesFacade } from '~viewer/annotaties/+state/annotaties.facade';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CollapsibleListComponent } from '~viewer/components/collapsible-list/collapsible-list.component';
import { MockComponent } from 'ng-mocks';
import { ApiSource } from '~model/internal/api-source';
import { SelectionObjectType } from '~store/common/selection/selection.model';

describe('ActiviteitenComponent', () => {
  let spectator: Spectator<ActiviteitenComponent>;
  const createComponent = createComponentFactory({
    component: ActiviteitenComponent,
    providers: [
      mockProvider(SelectionFacade),
      {
        provide: AnnotatiesFacade,
        useValue: {
          getAanduidingLocatiesByIds$: () => of([mockAanduidingLocatiesVM]),
          activiteitLocatieaanduidingenExpanded: () => {},
        },
      },
    ],
    declarations: [MockComponent(CollapsibleListComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  describe('created with preselection', () => {
    beforeEach(() => {
      spectator = createComponent({
        props: {
          preselected: true,
          activiteiten: [activiteitLocatieaanduidingenGroepVM],
          aanduidingenLocaties$: of([]),
          annotationId: {
            identificatie: 'regeltekstId',
            elementId: 'elementId',
          },
        },
      });
      spectator.detectComponentChanges();
    });

    it('should create', () => {
      expect(spectator.queryAll('dsov-selectable-list').length).toEqual(1);
    });

    it('return SelectableListVM', () => {
      expect(spectator.component.getActiviteitLocatieaanduidingen([activiteitLocatieaanduidingenGroepVM], [])).toEqual({
        items: [
          {
            id: 'activiteitId/activiteitlocatieaanduidingen/activiteitLocatieaanduidingId',
            regeltekstIdentificatie: 'regeltekstId',
            regeltekstTechnischId: undefined,
            name: 'naam',
            kwalificatie: 'regelkwalificatie ',
            apiSource: ApiSource.OZON,
            objectType: SelectionObjectType.REGELTEKST_ACTIVITEITLOCATIEAANDUIDING,
            symboolcode: undefined,
            isSelected: true,
            isOntwerp: false,
          },
        ],
      });
    });
  });

  describe('created without preselection', () => {
    beforeEach(() => {
      spectator = createComponent({
        props: {
          activiteiten: [activiteitLocatieaanduidingenGroepVM],
          aanduidingenLocaties$: of([]),
          preselected: false,
          annotationId: {
            identificatie: 'regeltekstId',
            elementId: 'elementId',
          },
        },
      });
    });

    it('should render gebiedsInfoActiviteiten after change input', () => {
      expect(spectator.queryAll('dsov-selectable-list').length).toEqual(1);
    });
  });
});
