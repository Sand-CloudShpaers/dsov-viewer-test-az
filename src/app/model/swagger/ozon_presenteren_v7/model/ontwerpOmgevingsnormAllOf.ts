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
import { Omgevingsnormgroep } from './omgevingsnormgroep';
import { Embedded1 } from './embedded1';


export interface OntwerpOmgevingsnormAllOf { 
    /**
     * TechnischId beschrijving
     */
    technischId: string;
    /**
     * ontwerpbesluitIdentificatie beschrijving
     */
    ontwerpbesluitIdentificatie: string;
    groep: Omgevingsnormgroep;
    _embedded?: Embedded1;
}

