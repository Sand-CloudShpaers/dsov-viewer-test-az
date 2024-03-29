/**
 * Omgevingsdocumenten-Presenteren
 * De Omgevingsdocumenten Presenteren API ontsluit beschikbaar gestelde omgevingsdocumenten op zo\'n manier dat deze eenvoudig visueel te verbeelden zijn. Op de Ontwikkel, Test, Acceptatie en Pre-productieomgeving worden ook omgevingsdocumenten toegevoegd en verwijderd door beheerders voor testdoeleinden binnen en buiten de voorziening.<br/> <br/> De Omgevingsdocumenten Presenteren API volgt de standaarden zoals beschreven in de DSO API-strategie versie 1.1. Zo is het standaard mediatype HAL (`application/hal+json`). Dit is een mediatype voor het weergeven van resources en hun relaties via hyperlinks.
 *
 * The version of the OpenAPI document: 7.5.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Bron } from './bron';
import { VlakOfMultivlak } from './vlakOfMultivlak';
import { WaardeEenheid } from './waardeEenheid';


export interface GebiedAllOf { 
    geometrie: VlakOfMultivlak;
    /**
     * De hoogte waarop de geometrie ligt, in meters.
     */
    hoogte?: Array<WaardeEenheid>;
    /**
     * De bron die is gebruikt voor, dan wel de wijze van inwinning van de geometrie. 
     */
    bron?: Array<Bron>;
    origineelCoordinaatSysteem?: string;
}

