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
import { LocatieType } from './locatieType';
import { OntwerpLocaties } from './ontwerpLocaties';
import { OntwerpRegistratiegegevens } from './ontwerpRegistratiegegevens';
import { SelfLinks } from './selfLinks';
import { Locaties } from './locaties';


/**
 * Duiding van een geografische positie. Indien er naar een locatie verwezen wordt vanuit een BevoegdGezag dan betreft dit een ambtsgebied.
 */
export interface OntwerpLocatie { 
    ontwerpbesluitIdentificatie?: string;
    /**
     * TechnischId beschrijving
     */
    technischId?: string;
    identificatie: string;
    /**
     * Tekstuele beschrijving van een Locatie, zodat er als zodanig over deze locatie gesproken kan worden. De beschrijving kan een bepaalde naam zijn waaronder de Locatie bekend staat, maar (lang) niet elke Locatie heef een naam.
     */
    noemer?: string;
    /**
     * Met deze status kan aangegeven aangegeven dat een OW-object beëindigd moet worden.
     */
    status?: string;
    omvat?: OntwerpLocaties;
    omvatVastgesteld?: Locaties;
    geregistreerdMet: OntwerpRegistratiegegevens;
    _links?: SelfLinks;
    locatieType?: LocatieType;
}

