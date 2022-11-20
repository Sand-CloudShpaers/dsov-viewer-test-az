import { Circle, Fill, Stroke, Style } from 'ol/style';

export class MapColorsConfig {
  public static readonly DRAW_POINT = new Style({});

  public static readonly DRAW = new Style({
    fill: new Fill({
      color: 'rgba(255, 112, 0, 0.25)',
    }),
    stroke: new Stroke({
      color: '#E17000',
      width: 2,
    }),
    image: new Circle({
      radius: 7,
      fill: new Fill({
        color: '#E17000',
      }),
    }),
  });
}
