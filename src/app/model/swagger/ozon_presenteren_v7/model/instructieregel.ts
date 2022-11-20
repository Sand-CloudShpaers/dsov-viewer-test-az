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
import { Adressaat } from './adressaat';
import { Regeltekst } from './regeltekst';
import { Kaart } from './kaart';
import { Thema } from './thema';
import { Gebiedsaanwijzing } from './gebiedsaanwijzing';
import { Idealisatie } from './idealisatie';
import { Instrument } from './instrument';
import { Omgevingsnorm } from './omgevingsnorm';
import { Locatie } from './locatie';
import { SelfLinks } from './selfLinks';


/**
 * De naam van het instrument waartoe de instructieregel zich richt.
 */
export interface Instructieregel { 
    identificatie: string;
    idealisatie: Idealisatie;
    /**
     * Één doorlopend stuk juridische tekst, van een artikel of een lid, die omschrijvingen van (een of meer) juridische regels bevat. 
     */
    omschrijving: string;
    thema?: Array<Thema>;
    /**
     * De locatieaanduiding begrenst de juridische werking van de regel in juridische zin, te weten dat de regel alleen binnen dit werkingsgebied werkingskracht heeft. 
     */
    definieert: Array<Locatie>;
    bevat?: Array<Kaart>;
    /**
     * Bij een regel die een gebiedsaanwijzing vastlegt geeft deze relatie aan om welk gebied en type gebied het gaat. De bijbehorende locatie(s) waar het om gaat is/zijn bij de gebiedsaanwijzing zelf te vinden.
     */
    beschrijftEenGebiedsaanwijzing?: Array<Gebiedsaanwijzing>;
    isOpgenomenIn: Regeltekst;
    _links: SelfLinks;
    /**
     * Het type bestuursorgaan dat of organisatie die de taak waarover de instructieregel gaat moet uitvoeren.
     */
    instructieregelInstrument?: Array<Instrument>;
    /**
     * Het type bestuursorgaan dat of organisatie die de taak waarover de instructieregel gaat moet uitvoeren.
     */
    instructieregelTaakuitoefening?: Array<Adressaat>;
    beschrijftEenOmgevingsnorm?: Array<Omgevingsnorm>;
}
