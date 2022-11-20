/**
 * Ruimtelijke Plannen API
 * De Ruimtelijke Plannen API is een aanvullende dienst ten opzichte van de diensten die Ruimtelijkeplannen.nl aanbiedt. De verantwoordelijkheid voor de Ruimtelijke Plannen API ligt bij Informatiehuis Ruimte. Tot de doelgroep van de Ruimtelijke Plannen API behoren de in ruimtelijke plannen geïnteresseerde personen met een sterke focus op de professionals. Van professionele gebruikers valt te verwachten dat deze deels vragen hebben die in een ruimere context gesteld moeten worden dan alleen ruimtelijke plannen. De Ruimtelijke Plannen API ontsluit echter alleen ruimtelijke plannen en geen informatie van andere thema’s. Voor de transformatie van coördinaten maken we gebruik van RDNAPTRANS.  Professionele gebruikers kunnen gebruik maken van de Ruimtelijke Plannen API van Informatiehuis Ruimte om ruimtelijke plannen op te halen en deze binnen hun eigen informatiehuishouding te combineren met andere gegevensdiensten of lokale (geo-)informatie. Dat is dan ook de plek om functionaliteit aan te bieden voor complexe vragen. Te denken valt daarbij aan de combinatie van ruimtelijke plannen met thematische (geo-)informatie als waterkansenkaart, geluidscontouren, etc.  Kortom de Ruimtelijke Plannen API is bedoeld voor geavanceerde en/of proces specifieke toepassingen, binnen de eigen informatiehuishouding. Het is alleen mogelijk informatie met betrekking tot de ruimtelijke plannen af te nemen en niet de onderliggende topografie en luchtfoto’s.   LET OP. Tot inwerkingtreding (IWT) van de Omgevingswet moet de gebruiker van deze API ermee rekening houden dat er oefencontent in de IHR datastore aanwezig kan zijn. Het is mogelijk dat deze oefencontent wordt uitgeserveerd bij het bevragen van deze API. De gebruiker van deze API wordt daarom dringend geadviseerd een disclaimer op te nemen in de toepassingen waarbinnen deze API ingezet wordt.
 *
 * The version of the OpenAPI document: 4.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { BaseStructuurvisiecomplex } from './baseStructuurvisiecomplex';
import { BaseStructuurvisieverklaring } from './baseStructuurvisieverklaring';
import { BaseBouwaanduiding } from './baseBouwaanduiding';
import { BaseBestemmingsvlak } from './baseBestemmingsvlak';
import { BaseStructuurvisiegebied } from './baseStructuurvisiegebied';
import { BaseBesluitvlak } from './baseBesluitvlak';
import { BaseFiguur } from './baseFiguur';
import { BaseFunctieaanduiding } from './baseFunctieaanduiding';
import { BaseMaatvoering } from './baseMaatvoering';
import { ChildTekst } from './childTekst';
import { BaseGebiedsaanduiding } from './baseGebiedsaanduiding';
import { BaseBesluitsubvlak } from './baseBesluitsubvlak';


export interface TekstWithAggregationsAllOfEmbedded { 
    children?: Array<ChildTekst>;
    bestemmingsvlakken?: Array<BaseBestemmingsvlak>;
    bestemmingsvlakIds?: Array<string>;
    bouwaanduidingen?: Array<BaseBouwaanduiding>;
    bouwaanduidingIds?: Array<string>;
    figuren?: Array<BaseFiguur>;
    figuurIds?: Array<string>;
    functieaanduidingen?: Array<BaseFunctieaanduiding>;
    functieaanduidingIds?: Array<string>;
    gebiedsaanduidingen?: Array<BaseGebiedsaanduiding>;
    gebiedsaanduidingIds?: Array<string>;
    maatvoeringen?: Array<BaseMaatvoering>;
    maatvoeringIds?: Array<string>;
    besluitvlakken?: Array<BaseBesluitvlak>;
    besluitvlakIds?: Array<string>;
    besluitsubvlakken?: Array<BaseBesluitsubvlak>;
    besluitsubvlakIds?: Array<string>;
    structuurvisiegebieden?: Array<BaseStructuurvisiegebied>;
    structuurvisiegebiedIds?: Array<string>;
    structuurvisiecomplexen?: Array<BaseStructuurvisiecomplex>;
    structuurvisiecomplexIds?: Array<string>;
    structuurvisieverklaringen?: Array<BaseStructuurvisieverklaring>;
    structuurvisieverklaringIds?: Array<string>;
}
