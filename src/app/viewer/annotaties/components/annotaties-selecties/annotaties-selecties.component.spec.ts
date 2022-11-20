import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AnnotatiesSelectiesComponent } from '~viewer/annotaties/components/annotaties-selecties/annotaties-selecties.component';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';
import { Selection, SelectionObjectType } from '~store/common/selection/selection.model';
import { ApiSource } from '~model/internal/api-source';
import { mockAnnotationId } from '~viewer/annotaties/+state/annotaties.selectors.spec';

describe('AnnotatiesSelectiesComponent', () => {
  let spectator: Spectator<AnnotatiesSelectiesComponent>;
  const spyOnAddSelections = jasmine.createSpy('spyOnAddSelections');
  const spyOnRemoveSelectionsForAnnotation = jasmine.createSpy('spyOnRemoveSelectionsForAnnotation');

  const createComponent = createComponentFactory({
    component: AnnotatiesSelectiesComponent,
    providers: [
      mockProvider(SelectionFacade, {
        addSelections: spyOnAddSelections,
        removeSelectionsForAnnotation: spyOnRemoveSelectionsForAnnotation,
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  const selections: Selection[] = [
    {
      id: 'locatie',
      regeltekstIdentificatie: mockAnnotationId.identificatie,
      regeltekstTechnischId: undefined,
      apiSource: ApiSource.OZON,
      name: 'De Wieden',
      objectType: SelectionObjectType.WERKINGSGEBIED,
      isOntwerp: false,
      symboolcode: 'werkingsgebied',
    },
    {
      id: 'nl.imow-pv23.gebiedsaanwijzing.PVO1gaNietNNN',
      name: 'Niet Natuurnetwerk Nederland',
      regeltekstIdentificatie: mockAnnotationId.identificatie,
      regeltekstTechnischId: undefined,
      apiSource: ApiSource.OZON,
      objectType: SelectionObjectType.GEBIEDSAANWIJZING,
      symboolcode: 'vsg030',
      isOntwerp: false,
    },
    {
      id: 'ala',
      name: 'ontgronden',
      apiSource: ApiSource.OZON,
      regeltekstIdentificatie: mockAnnotationId.identificatie,
      regeltekstTechnischId: undefined,
      objectType: SelectionObjectType.REGELTEKST_ACTIVITEITLOCATIEAANDUIDING,
      symboolcode: undefined,
      isOntwerp: false,
    },
    {
      id: 'nl.imow-gm0297.normwaarde.2020000001',
      parentId: 'nl.imow-gm0297.omgevingsnorm.2019000002',
      parentName: 'maximum bouwhoogte bedrijfsgebouw',
      regeltekstIdentificatie: mockAnnotationId.identificatie,
      regeltekstTechnischId: undefined,
      apiSource: ApiSource.OZON,
      objectType: SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
      isOntwerp: false,
      name: 'norm1',
    },
  ];

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    spectator.component.gebiedenInFilter = [
      {
        id: 'nl.imow-pv23.gebiedsaanwijzing.PVO1gaNietNNN',
        name: 'Niet Natuurnetwerk Nederland',
      },
    ];
    spectator.component.gebiedsaanwijzingen = [
      {
        gebiedsaanwijzingType: 'RuimtelijkGebruik',
        gebiedsaanwijzingen: [
          {
            groep: 'overig',
            identificatie: 'nl.imow-pv23.gebiedsaanwijzing.PVO1gaNietNNN',
            isOntwerp: false,
            isSelected: true,
            naam: 'Niet Natuurnetwerk Nederland',
            symboolcode: 'vsg030',
          },
        ],
        label: 'Ruimtelijkgebruikgebiedsaanwijzingen',
      },
    ];
    spectator.component.locaties = [
      {
        identificatie: 'locatie',
        isOntwerp: false,
        isSelected: false,
        naam: 'De Wieden',
        symboolcode: 'werkingsgebied',
      },
    ];
    spectator.component.activiteitLocatieaanduidingen = [
      {
        code: 'Ontgrondingsactiviteit',
        waarde: 'ontgrondingsactiviteit',
        activiteitLocatieaanduidingen: [
          {
            identificatie: 'ala',
            isOntwerp: false,
            isSelected: false,
            kwalificeertHref: 'href',
            naam: 'ontgronden',
            regelkwalificatie: 'toegestaan',
            symboolcode: undefined,
          },
        ],
      },
    ];
    spectator.component.omgevingswaarden = [];
    spectator.component.omgevingsnormen = [
      {
        identificatie: 'nl.imow-gm0297.omgevingsnorm.2019000002',
        naam: 'maximum bouwhoogte bedrijfsgebouw',
        normen: [
          {
            identificatie: 'nl.imow-gm0297.omgevingsnorm.2019000002',
            naam: 'maximum bouwhoogte bedrijfsgebouw',

            type: 'maximum bouwhoogte',
            normType: NormType.OMGEVINGSNORMEN,
            normwaarden: [
              {
                identificatie: 'nl.imow-gm0297.normwaarde.2020000001',
                naam: 'norm1',
                isSelected: false,
                isOntwerp: false,
                symboolcode: 'symbool',
              },
            ],
          },
        ],
      },
    ];
    spectator.component.bestemmingsplanFeatures = undefined;
    spectator.component.annotationId = mockAnnotationId;
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should addToSelections onInit', () => {
    spectator.component.ngOnInit();

    expect(spyOnAddSelections).toHaveBeenCalledWith(selections);
  });

  it('should removeFromSelections onDestroy', () => {
    spectator.component.annotationId = {
      identificatie: 'regeltekstId',
      elementId: 'elementId',
    };
    spectator.component.ngOnDestroy();

    expect(spyOnRemoveSelectionsForAnnotation).toHaveBeenCalledWith({
      identificatie: 'regeltekstId',
      elementId: 'elementId',
    });
  });
});
