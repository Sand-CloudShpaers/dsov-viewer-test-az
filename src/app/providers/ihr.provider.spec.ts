import { IhrProvider } from '~providers/ihr.provider';
import GeoJSON from 'ol/format/GeoJSON';
import { GeometryCollection, Point } from 'ol/geom';

describe('constructPostBody', () => {
  it('should return undefined when no geometry is provided', () => {
    expect(IhrProvider.constructPostBodyIHR({ id: 'location', name: 'location', geometry: null })).toBeUndefined();
  });

  it('should return a geo object with intersectsAndNotTouches for single geometries', () => {
    const expectedGeoObject = {
      _geo: {
        intersectAndNotTouches: new GeoJSON().writeGeometryObject(new Point([0, 1])),
      },
    };

    expect(
      IhrProvider.constructPostBodyIHR({
        id: 'locatie',
        name: 'locatie',
        geometry: new Point([0, 1]),
      })
    ).toEqual(expectedGeoObject);
  });

  it('should return a geo object with intersects for GeometryCollections', () => {
    const expectedGeoObject = {
      _geo: {
        intersects: new GeoJSON().writeGeometryObject(new GeometryCollection([new Point([0, 1]), new Point([1, 0])])),
      },
    };

    expect(
      IhrProvider.constructPostBodyIHR({
        id: 'locatie',
        name: 'locatie',
        geometry: new GeometryCollection([new Point([0, 1]), new Point([1, 0])]),
      })
    ).toEqual(expectedGeoObject);
  });
});
