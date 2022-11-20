import { TimeTravelDates } from '~model/time-travel-dates';

// Om bij terugreizen te zien wat je op die datum ook zou zien wordt als tijd 1 seconde voor midernacht gehanteerd,
// zodat alle regelingen die op die dag nog zijn geregistreerd gevonden kunnen worden.
const beschikbaarOpTime = 'T23:59:59Z';

enum DocumentType {
  REGELING = 'Regeling',
  ONTWERP_REGELING = 'OntwerpRegeling',
  OMGEVINGSVERGUNNING = 'Omgevingsvergunning',
  PLAN = 'Plan',
}

export class ApiUtils {
  public static isOzonDocument(documentId: string): boolean {
    return this.isRegeling(documentId) || this.isOntwerpRegeling(documentId) || this.isOmgevingsvergunning(documentId);
  }

  public static isIhrDocument(documentId: string): boolean {
    return this.getDocumentType(documentId) === DocumentType.PLAN;
  }

  public static isRegeling(documentId: string): boolean {
    return this.getDocumentType(documentId) === DocumentType.REGELING;
  }

  public static isOntwerpRegeling(documentId: string): boolean {
    return this.getDocumentType(documentId) === DocumentType.ONTWERP_REGELING;
  }

  public static isOmgevingsvergunning(documentId: string): boolean {
    return this.getDocumentType(documentId) === DocumentType.OMGEVINGSVERGUNNING;
  }

  private static getDocumentType(documentId: string): DocumentType {
    if (documentId?.includes('NL.IMRO')) {
      // IHR cq IMRO documenten beginnen altijd met 'NL.IMRO', het is dus een plan
      return DocumentType.PLAN;
    } else if (!documentId?.startsWith('http')) {
      if (documentId?.includes('akn_nl_bill')) {
        // Ontwerp Regelingen hebben altijd de volgende reeks in het technischeId: 'akn_nl_bill'
        return DocumentType.ONTWERP_REGELING;
      } else if (documentId?.startsWith('/akn/nl/act')) {
        // Vastgestelde Regelingen beginnen altijd met /akn/nl/act
        return DocumentType.REGELING;
      } else {
        return DocumentType.OMGEVINGSVERGUNNING;
      }
    }
    return null;
  }

  public static addTimeTravelAsQueryParamStringForOzon(url: string, dates: TimeTravelDates): string {
    const resultingUrl = new URL(url);

    // Check of het request tijdreis parameters ondersteund
    if (this.isTimeTravelParameterAllowed(resultingUrl)) {
      if (!resultingUrl.pathname.includes('/ontwerp') && dates?.geldigOp) {
        if (!resultingUrl.searchParams.has('geldigOp') && dates.geldigOp) {
          resultingUrl.searchParams.set('geldigOp', dates.geldigOp);
        }
        if (!resultingUrl.searchParams.has('inWerkingOp') && (dates.inWerkingOp || dates.geldigOp)) {
          resultingUrl.searchParams.set('inWerkingOp', dates.inWerkingOp || dates.geldigOp);
        }
        if (!resultingUrl.searchParams.has('beschikbaarOp') && (dates.beschikbaarOp || dates.geldigOp)) {
          resultingUrl.searchParams.set('beschikbaarOp', dates.beschikbaarOp || dates.geldigOp + beschikbaarOpTime);
        }
      }

      // Voor alle requests die met tijdreisparamters kunnen werken, moet de `beschikbaarOp` of de `synchroniseerMetTileSet` parameter gevuld zijn.
      // De `synchroniseerMetTileSet` parameter zorgt ervoor dat alle resultaten ook aanwezig zijn in de vector tile set.
      // Deze parameter maakt impliciet een tijdreis request waarbij de `beschikbaarOp` parameter wordt ingevuld door Ozon met de tijd waarop de laatste tile set is gemaakt.
      // Deze twee parameters zijn niet te combineren. Wanneer dit gebeurt, overschrijft `beschikbaarOp` de `synchroniseerMetTileSet` parameter
      if (
        !resultingUrl.searchParams.has('beschikbaarOp') &&
        !resultingUrl.searchParams.has('synchroniseerMetTileSet')
      ) {
        const synchroniseerMetTileset = this.getSynchroniseValue(resultingUrl);
        resultingUrl.searchParams.set('synchroniseerMetTileSet', synchroniseerMetTileset);
      }
    }

    return resultingUrl.toString();
  }

  // `synchroniseerMetTileSet` kan twee waarden hebben (afhankelijk van met welke tile set de syncrhonisatie moet plaatsvinden)
  // De zoekresultaten bevatten ook toekomstige regelingen; deze zitten niet in de actuele tile set (normaal) waardoor met de totaal set (volledig) gesynchroniseerd moet worden
  private static getSynchroniseValue(url: URL): string {
    return url.pathname.includes('/_suggesties') ? 'volledig' : 'normaal';
  }

  // De meeste Ozon requests ondersteunen de `synchroniseerMetTileSet` parameter, maar niet alle.
  // Deze functie bevat alle requests die de parameter NIET ondersteunen.
  // Dit om ervoor te zorgen dat de parameter standaard wordt toegevoegd aan alle (nieuwe) requests en niet wordt vergeten.
  // Het onbedoeld toevoegen van de parameter aan nieuwe requests die deze parameter niet ondersteunen levert namelijk een foutmelding op en zal dus eerder opvallen.
  private static isTimeTravelParameterAllowed(url: URL): boolean {
    const excludePaths = ['/afbeeldingen', '/ontwerpafbeeldingen', '/health', '/app-info'];
    return !excludePaths.some(str => url.pathname.includes(str));
  }
}
