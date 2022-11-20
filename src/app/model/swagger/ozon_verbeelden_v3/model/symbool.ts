/**
 * Omgevingsdocumenten-Verbeelden-v3
 * De Omgevingsdocumenten Verbeelden API ontsluit informatie tbv het verbeelden van beschikbaar gestelde omgevingsdocumenten. Op de Ontwikkel, Test, Acceptatie en Pre-productieomgeving worden ook omgevingsdocumenten toegevoegd en verwijderd door beheerders voor testdoeleinden binnen en buiten de voorziening.<br/> <br/>  De Omgevingsdocumenten Verbeelden API volgt de standaarden zoals beschreven in de DSO API-strategie versie 1.1. Zo is het standaard mediatype HAL (`application/hal+json`). Dit is een mediatype voor het weergeven van resources en hun relaties via hyperlinks. Layers zijn gebaseerd op de <a href=\"https://docs.ogc.org/DRAFTS/20-057.html\">OGC API Tiles</a>.
 *
 * The version of the OpenAPI document: 3.2.2
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Layout } from './layout';
import { Paint } from './paint';


export interface Symbool {
    id: string;
    type: Symbool.TypeEnum;
    niveau?: number;
    source: string;
    'source-layer': Symbool.SourceLayerEnum;
    paint: Paint;
    layout: Layout;
    filter: Array<object>;
}
export namespace Symbool {
    export type TypeEnum = 'line' | 'circle' | 'fill' | 'symbol';
    export const TypeEnum = {
        Line: 'line' as TypeEnum,
        Circle: 'circle' as TypeEnum,
        Fill: 'fill' as TypeEnum,
        Symbol: 'symbol' as TypeEnum
    };
    export type SourceLayerEnum = 'vlaklocaties' | 'puntlocaties' | 'lijnlocaties' | 'vlaklocaties_totaal' | 'puntlocaties_totaal' | 'lijnlocaties_totaal' | 'ontwerp_vlaklocaties' | 'ontwerp_puntlocaties' | 'ontwerp_lijnlocaties';
    export const SourceLayerEnum = {
        Vlaklocaties: 'vlaklocaties' as SourceLayerEnum,
        Puntlocaties: 'puntlocaties' as SourceLayerEnum,
        Lijnlocaties: 'lijnlocaties' as SourceLayerEnum,
        VlaklocatiesTotaal: 'vlaklocaties_totaal' as SourceLayerEnum,
        PuntlocatiesTotaal: 'puntlocaties_totaal' as SourceLayerEnum,
        LijnlocatiesTotaal: 'lijnlocaties_totaal' as SourceLayerEnum,
        OntwerpVlaklocaties: 'ontwerp_vlaklocaties' as SourceLayerEnum,
        OntwerpPuntlocaties: 'ontwerp_puntlocaties' as SourceLayerEnum,
        OntwerpLijnlocaties: 'ontwerp_lijnlocaties' as SourceLayerEnum
    };
}


