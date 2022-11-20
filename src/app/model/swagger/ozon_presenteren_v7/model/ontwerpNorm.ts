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
import { OntwerpNormwaarde } from './ontwerpNormwaarde';
import { OntwerpRegistratiegegevens } from './ontwerpRegistratiegegevens';
import { SelfLinks } from './selfLinks';


/**
 * Een omgevingswaarde of een omgevingsnorm, met een normatief karakter, die beschreven worden middels normwaarden. Een normwaarde kan kwalitatief of kwantitatief zijn.
 */
export interface OntwerpNorm { 
    identificatie: string;
    naam: string;
    /**
     * Één van de kwantitatieve of kwalitatieve waarden van een norm. 
     */
    normwaarde: Array<OntwerpNormwaarde>;
    eenheid?: Array<Eenheid>;
    type: Typenorm;
    /**
     * Met deze status kan aangegeven aangegeven dat een OW-object beëindigd moet worden.
     */
    status?: string;
    geregistreerdMet: OntwerpRegistratiegegevens;
    _links: SelfLinks;
}

