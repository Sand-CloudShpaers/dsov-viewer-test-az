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
import { Eenheid } from './eenheid';
import { Typenorm } from './typenorm';
import { Registratiegegevens } from './registratiegegevens';
import { Normwaarde } from './normwaarde';
import { Omgevingswaardegroep } from './omgevingswaardegroep';
import { Embedded } from './embedded';
import { NormLinks } from './normLinks';


/**
 * Norm die de gewenste staat of kwaliteit van (een onderdeel van) de fysieke leefomgeving, de toelaatbare belasting door activiteiten en/of de toelaatbare concentratie of depositie van stoffen als beleidsdoel vastlegt. 
 */
export interface Omgevingswaarde { 
    identificatie: string;
    naam: string;
    /**
     * Één van de kwantitatieve of kwalitatieve waarden van een norm. 
     */
    normwaarde: Array<Normwaarde>;
    eenheid?: Array<Eenheid>;
    type: Typenorm;
    geregistreerdMet: Registratiegegevens;
    _links: NormLinks;
    groep: Omgevingswaardegroep;
    _embedded?: Embedded;
}

