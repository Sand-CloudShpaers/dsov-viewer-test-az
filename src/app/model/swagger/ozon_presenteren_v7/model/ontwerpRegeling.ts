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
import { SoortRegeling } from './soortRegeling';
import { OntwerpLocatie } from './ontwerpLocatie';
import { OntwerpRegelingLinks } from './ontwerpRegelingLinks';
import { Locatie } from './locatie';
import { OntwerpRegistratiegegevens } from './ontwerpRegistratiegegevens';
import { Procedureverloop } from './procedureverloop';
import { Regeling } from './regeling';
import { BevoegdGezag } from './bevoegdGezag';


/**
 * Een ontwerp tekst (met eventuele afbeeldingen en andere multimedia-elementen) die juridische voorschriften van algemene strekking of beleidsregels bevat.
 */
export interface OntwerpRegeling { 
    /**
     * De identificatie waaronder elk object van dit type bekend is.
     */
    identificatie: string;
    /**
     * De unieke ontwerpbesluitIdentificatie waaronder elk object van dit type bekend is.
     */
    ontwerpbesluitIdentificatie: string;
    /**
     * Een technische identificatie voor ontwerpobjecten, samengesteld uit de IMOW-identificatie en de ontwerpbesluitIdentificatie, die gebruikt kan worden als pad parameter en in zoekopdrachten.
     */
    technischId: string;
    /**
     * De unieke expressionId waaronder elk object van dit type bekend is.
     */
    expressionId?: string;
    /**
     * De volledige, officiële titel van een Omgevingsdocument zoals die door het bevoegd gezag is vastgesteld.
     */
    officieleTitel: string;
    aangeleverdDoorEen: BevoegdGezag;
    type: SoortRegeling;
    /**
     * De titel van de Regeling zoals deze wordt gebruikt in aanhalingen.
     */
    citeerTitel?: string;
    /**
     * Het opschrift van de Regeling. Deze dient overeen te komen met de officiële titel van de Regeling.
     */
    opschrift?: string;
    /**
     * Verwijzing naar het besluit dat ten grondslag heeft gelegen aan het ontwerpbesluit.
     */
    publicatieID?: string;
    /**
     * De verhouding is tussen dit tijdelijk deel en de hoofdregeling.
     */
    conditie?: string;
    /**
     * De Regeling die een andere Regeling vervangt (en daarmee de opvolger van de oude Regeling is).
     */
    opvolgerVan?: Array<Regeling>;
    heeftRegelingsgebied?: Locatie;
    heeftOntwerpRegelingsgebied?: OntwerpLocatie;
    procedureverloop?: Procedureverloop;
    heeftBijlagen?: boolean;
    heeftToelichtingen?: boolean;
    geregistreerdMet: OntwerpRegistratiegegevens;
    _links: OntwerpRegelingLinks;
}

