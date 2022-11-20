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
import { OntwerpDivisieannotatieLinks } from './ontwerpDivisieannotatieLinks';
import { Thema } from './thema';
import { RegeltekstDocumentKruimelpadInner } from './regeltekstDocumentKruimelpadInner';
import { Embedded1 } from './embedded1';
import { Locatie } from './locatie';
import { OntwerpRegistratiegegevens } from './ontwerpRegistratiegegevens';


/**
 * OntwerpDivisieannotatie kan een Divisie of een DivisieTekst zijn, zoals beschreven in CIMOW
 */
export interface OntwerpDivisieannotatie { 
    identificatie: string;
    ontwerpbesluitIdentificatie?: string;
    /**
     * Een technische identificatie voor ontwerpobjecten, samengesteld uit de IMOW-identificatie en de ontwerpbesluitIdentificatie, die gebruikt kan worden als pad parameter en in zoekopdrachten.
     */
    technischId: string;
    heeftWerkingIn?: Array<Locatie>;
    themas?: Array<Thema>;
    /**
     * Met deze status kan aangegeven aangegeven dat een OW-object beëindigd moet worden.
     */
    status?: string;
    geregistreerdMet: OntwerpRegistratiegegevens;
    _links: OntwerpDivisieannotatieLinks;
    documentTechnischId?: string;
    /**
     * Een lijst van verwijzingen naar regelteksten, oftewel artikelen en/of leden, die juridische regels bevatten over de deze activiteit. De verwijzing is in deze de identificatie van een regeltekst, in de vorm van een AKN identificatie. Het gaat om alle regels in de tijd (verleden heden, toekomst). Desgewenst kunnen tijdreisparameters aangegeven worden, om een extra filter aan te brengen.
     */
    juridischeGrondslagIdentificatie?: Array<string>;
    documentKruimelpad?: Array<RegeltekstDocumentKruimelpadInner>;
    _embedded?: Embedded1;
}

