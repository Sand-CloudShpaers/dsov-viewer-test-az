import { Style } from 'mapbox-gl';

export const mapboxStyleMock = {
  version: 8,
  sprite: '',
  sprite_ref: 'generiek_symbool',
  sources: {
    omgevingsdocument: {
      type: 'vector',
    },
  },
  layers: [
    {
      id: 'vsg030-fill',
      type: 'fill',
      source: 'omgevingsdocument',
      'source-layer': 'vlaklocaties',
      paint: {
        'fill-opacity': 0.5,
        'fill-color': '#FFFFFF',
      },
      filter: ['all', ['==', 'identificatie', 'nl.imow-pv26.gebied.2020000000234'], ['==', 'versie', 1]],
    },
    {
      id: 'vsg030-line',
      type: 'line',
      source: 'omgevingsdocument',
      'source-layer': 'vlaklocaties',
      paint: {
        lineColor: '#CE3F51',
        lineWidth: 3,
      },
      filter: ['all', ['==', 'identificatie', 'nl.imow-pv26.gebied.2020000000234'], ['==', 'versie', 1]],
    },
  ],
} as Style;
