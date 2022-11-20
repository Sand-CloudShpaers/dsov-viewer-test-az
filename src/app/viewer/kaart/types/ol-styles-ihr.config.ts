import { Fill, Stroke, Style } from 'ol/style';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';

export class OlStylesIhrConfig {
  public static context: CanvasRenderingContext2D;
  public static pattern: CanvasPattern;

  public static readonly PLANOBJECTSTYLE = (feature: Feature<Geometry>): Style => {
    let imageSource;
    switch (feature.getProperties()['symboolcode']) {
      case 'enkelbestemming_agrarisch':
        return OlStylesIhrConfig.getFillStyle('#EBF0D2');
      case 'enkelbestemming_agrarisch_met_waarden':
        return OlStylesIhrConfig.getFillStyle('#D2E1A5');
      case 'enkelbestemming_bedrijf':
        return OlStylesIhrConfig.getFillStyle('#C8A0D7');
      case 'enkelbestemming_bedrijventerrein':
        return OlStylesIhrConfig.getFillStyle('#C8A0D7');
      case 'enkelbestemming_bos':
        return OlStylesIhrConfig.getFillStyle('#64AA2D');
      case 'enkelbestemming_centrum':
        return OlStylesIhrConfig.getFillStyle('#FFC8BE');
      case 'enkelbestemming_cultuur_en_ontspanning':
        return OlStylesIhrConfig.getFillStyle('#FF3C82');
      case 'enkelbestemming_detailhandel':
        return OlStylesIhrConfig.getFillStyle('#FFA096');
      case 'enkelbestemming_dienstverlening':
        return OlStylesIhrConfig.getFillStyle('#F091BE');
      case 'enkelbestemming_gemengd':
        return OlStylesIhrConfig.getFillStyle('#FFBE87');
      case 'enkelbestemming_groen':
        return OlStylesIhrConfig.getFillStyle('#28C846');
      case 'enkelbestemming_horeca':
        return OlStylesIhrConfig.getFillStyle('#FF6923');
      case 'enkelbestemming_infrastructuur':
        return OlStylesIhrConfig.getFillStyle('#CDCDCD');
      case 'enkelbestemming_kantoor':
        return OlStylesIhrConfig.getFillStyle('#EBC3d7');
      case 'enkelbestemming_maatschappelijk':
        return OlStylesIhrConfig.getFillStyle('#DC9B78');
      case 'enkelbestemming_natuur':
        return OlStylesIhrConfig.getFillStyle('#82A591');
      case 'enkelbestemming_recreatie':
        return OlStylesIhrConfig.getFillStyle('#B9D746');
      case 'enkelbestemming_sport':
        return OlStylesIhrConfig.getFillStyle('#82C846');
      case 'enkelbestemming_tuin':
        return OlStylesIhrConfig.getFillStyle('#C8D76E');
      case 'enkelbestemming_verkeer':
        return OlStylesIhrConfig.getFillStyle('#CDCDCD');
      case 'enkelbestemming_ontspanning_en_vermaak':
        return OlStylesIhrConfig.getFillStyle('#FF3C82');
      case 'enkelbestemming_water':
        return OlStylesIhrConfig.getFillStyle('#AFCDE1');
      case 'enkelbestemming_wonen':
        return OlStylesIhrConfig.getFillStyle('#FFFF00');
      case 'enkelbestemming_woongebied':
        return OlStylesIhrConfig.getFillStyle('#FFFFB4');
      case 'enkelbestemming_overig':
        return OlStylesIhrConfig.getFillStyle('#EBE1EB');
      case 'dubbelbestemming_leiding':
        imageSource = 'bp_db_leiding.png';
        break;
      case 'dubbelbestemming_waterstaat':
        imageSource = 'bp_db_waterstaat.png';
        break;
      case 'dubbelbestemming_waarde':
        imageSource = 'bp_db_waarde.png';
        break;
      case 'bouwvlak':
        return OlStylesIhrConfig.getStrokeStyle('#000000', 1.5);
      case 'maatvoering':
        return OlStylesIhrConfig.getDashedStrokeStyle('#000000', 1.5, [8, 4]);
      default:
        return undefined;
    }
    if (imageSource) {
      OlStylesIhrConfig.setImageFillStyle(feature, imageSource);
    }
    return undefined;
  };

  private static getFillStyle(fillcolor: string): Style {
    return new Style({
      fill: new Fill({
        color: fillcolor,
      }),
      stroke: new Stroke({
        color: '#000000',
      }),
      zIndex: 1,
    });
  }

  private static getStrokeStyle(linecolor: string, linewidth: number): Style {
    return new Style({
      stroke: new Stroke({
        color: linecolor,
        width: linewidth,
      }),
      zIndex: 3,
    });
  }

  private static getDashedStrokeStyle(color: string, width: number, lineDash: number[]): Style {
    return new Style({
      stroke: new Stroke({
        color,
        width,
        lineDash,
      }),
      zIndex: 3,
    });
  }

  private static setImageFillStyle = (feature: Feature<Geometry>, imageSource: string): void => {
    const canvas = document.createElement('canvas');
    OlStylesIhrConfig.context = canvas.getContext('2d');
    OlStylesIhrConfig.setPatternStyle(feature, imageSource);
  };

  private static setPatternStyle = (feature: Feature<Geometry>, imageSource: string): void => {
    const base_image = new Image();
    base_image.src = 'assets/images/sld-symbols/' + imageSource;
    base_image.onload = (): void => {
      OlStylesIhrConfig.context.drawImage(base_image, 0, 0);
      OlStylesIhrConfig.pattern = OlStylesIhrConfig.context.createPattern(base_image, 'repeat');
      feature.setStyle(
        new Style({
          fill: new Fill({
            color: OlStylesIhrConfig.pattern,
          }),
          stroke: new Stroke({
            color: '#000000',
          }),
          zIndex: 2,
        })
      );
    };
  };
}
