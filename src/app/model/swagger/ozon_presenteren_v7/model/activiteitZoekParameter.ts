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


/**
 * Zoekobject om Activiteiten te zoeken met een parameter.
 */
export interface ActiviteitZoekParameter { 
    parameter?: ActiviteitZoekParameter.ParameterEnum;
    /**
     * Waarden waarop gezocht moet worden voor de betreffende parameter
     */
    zoekWaarden?: Array<string>;
}
export namespace ActiviteitZoekParameter {
    export type ParameterEnum = 'identificatie' | 'regeltekst.type' | 'locatie.identificatie' | 'juridischeregel.thema' | 'document.identificatie' | 'document.type' | 'document.bestuurslaag' | 'ontwerpdocument.technischId';
    export const ParameterEnum = {
        Identificatie: 'identificatie' as ParameterEnum,
        RegeltekstType: 'regeltekst.type' as ParameterEnum,
        LocatieIdentificatie: 'locatie.identificatie' as ParameterEnum,
        JuridischeregelThema: 'juridischeregel.thema' as ParameterEnum,
        DocumentIdentificatie: 'document.identificatie' as ParameterEnum,
        DocumentType: 'document.type' as ParameterEnum,
        DocumentBestuurslaag: 'document.bestuurslaag' as ParameterEnum,
        OntwerpdocumentTechnischId: 'ontwerpdocument.technischId' as ParameterEnum
    };
}


