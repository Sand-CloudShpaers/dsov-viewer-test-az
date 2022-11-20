import { Highlight } from '../types/highlight.model';
import { ApiSource } from '~model/internal/api-source';
import { Verbeelding } from '~ozon-model-verbeelden/verbeelding';
import { SelectionObjectType } from '~store/common/selection/selection.model';

export const verbeeldingMock: Verbeelding = {
  mapboxstyle: {
    version: 8,
    sprite: '',
    'sprite-ref': 'generiek_symbool',
    sources: { omgevingsdocument: { type: 'vector' } },
    layers: [
      {
        id: 'vog004-fill',
        type: 'fill',
        source: 'omgevingsdocument',
        'source-layer': 'vlaklocaties',
        paint: { 'fill-color': '#808080', 'fill-opacity': 0.0 },
        layout: {},
        filter: [
          'any' as unknown as object,
          ['all', ['==', 'identificatie', 'nl.imow-gm0297.gebied.2019000002'], ['==', 'versie', 1]],
          ['all', ['==', 'identificatie', 'nl.imow-gm0297.gebied.2021000001'], ['==', 'versie', 1]],
          ['all', ['==', 'identificatie', 'nl.imow-gm0297.gebied.2019000003'], ['==', 'versie', 1]],
        ],
      },
      {
        id: 'vog004-line',
        type: 'line',
        source: 'omgevingsdocument',
        'source-layer': 'vlaklocaties',
        paint: { 'line-color': '#64aa2d', 'line-opacity': 1.0, 'line-width': 4.0 },
        layout: {},
        filter: [
          'any' as unknown as object,
          ['all', ['==', 'identificatie', 'nl.imow-gm0297.gebied.2019000002'], ['==', 'versie', 1]],
          ['all', ['==', 'identificatie', 'nl.imow-gm0297.gebied.2021000001'], ['==', 'versie', 1]],
          ['all', ['==', 'identificatie', 'nl.imow-gm0297.gebied.2019000003'], ['==', 'versie', 1]],
        ],
      },
      {
        id: 'regelingsgebied-grens1',
        type: 'line',
        source: 'omgevingsdocument',
        'source-layer': 'vlaklocaties',
        paint: { 'line-color': '#000000', 'line-opacity': 1.0, 'line-width': 1.0 },
        layout: {},
        filter: [
          'all' as unknown as object,
          ['==', 'identificatie', 'nl.imow-gm0297.ambtsgebied.ZaltbommelAmbtsgebied'],
          ['==', 'versie', 1],
        ],
      },
      {
        id: 'regelingsgebied-grens2',
        type: 'line',
        source: 'omgevingsdocument',
        'source-layer': 'vlaklocaties',
        paint: { 'line-color': '#000000', 'line-opacity': 1.0, 'line-width': 5.0, 'line-dasharray': ['0.15', '2.8'] },
        layout: { 'line-cap': 'round' },
        filter: [
          'all' as unknown as object,
          ['==', 'identificatie', 'nl.imow-gm0297.ambtsgebied.ZaltbommelAmbtsgebied'],
          ['==', 'versie', 1],
        ],
      },
    ],
  },
  symboolmetadata: [
    {
      identificator: 'nl.imow-gm0297.omgevingsnorm.2019000001',
      objecttype: 'normwaarde',
      symboolcode: 'vsgt201',
      locaties: [
        {
          identificatie: 'nl.imow-gm0297.omgevingsnorm.2019000008',
          versie: 1,
        },
        {
          identificatie: 'nl.imow-gm0297.omgevingsnorm.2019000009',
          versie: 1,
        },
      ],
    },
    {
      identificator: 'nl.imow-gm0297.omgevingsnorm.2019000002',
      objecttype: 'kaartlaag',
      symboolcode: 'vag100',
      locaties: [
        {
          identificatie: 'nl.imow-gm0297.omgevingsnorm.2019000008',
          versie: 1,
        },
        {
          identificatie: 'nl.imow-gm0297.omgevingsnorm.2019000009',
          versie: 1,
        },
      ],
    },
    { identificator: 'nl.imow-gm0297.omgevingsnorm.2019000003', objecttype: 'omgevingsnorm', symboolcode: 'vag100' },
    {
      identificator: 'nl.imow-gm0297.gebiedsaanwijzing.2019000003',
      objecttype: 'gebiedsaanwijzing',
      symboolcode: 'vsgt304',
    },
  ],
};

export const highlightMock: Highlight = {
  id: 'schaap',
  apiSource: ApiSource.OZON,
  selections: [
    {
      id: 'schaap',
      apiSource: ApiSource.OZON,
      objectType: SelectionObjectType.REGELINGSGEBIED,
      name: 'document',
    },
  ],
  verbeelding: verbeeldingMock,
};
