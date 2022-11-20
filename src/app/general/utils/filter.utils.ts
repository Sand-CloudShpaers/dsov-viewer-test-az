import { ApiSource } from '~model/internal/api-source';
import {
  FilterIdentification,
  FilterName,
  FilterOptions,
  RegelgevingtypeFilter,
} from '~viewer/filter/types/filter-options';
import { RegeltekstZoekParameter } from '~ozon-model/regeltekstZoekParameter';
import {
  activiteitZoekUrl,
  documentregeltekstZoekUrl,
  gebiedsaanwijzingZoekUrl,
  omgevingsnormZoekUrl,
  omgevingswaardeZoekUrl,
  ontwerpDocumentregeltekstZoekUrl,
  ontwerpRegeltekstZoekUrl,
  regeltekstZoekUrl,
} from '~viewer/filtered-results/services/ozon-documenten.service';
import { ActiviteitLocatieaanduidingZoekParameter } from '~ozon-model/activiteitLocatieaanduidingZoekParameter';
import { DivisieannotatieZoekParameter } from '~ozon-model/divisieannotatieZoekParameter';
import { DocumentregeltekstZoekParameter } from '~ozon-model/documentregeltekstZoekParameter';
import { HoofdlijnZoekParameter } from '~ozon-model/hoofdlijnZoekParameter';
import { KaartZoekParameter } from '~ozon-model/kaartZoekParameter';
import { OntwerpActiviteitLocatieaanduidingZoekParameter } from '~ozon-model/ontwerpActiviteitLocatieaanduidingZoekParameter';
import { OntwerpDivisieannotatieZoekParameter } from '~ozon-model/ontwerpDivisieannotatieZoekParameter';
import { OntwerpRegeltekstZoekParameter } from '~ozon-model/ontwerpRegeltekstZoekParameter';
import { GeoJsonZoekObject } from '~http/ozon.http-client';

export type OzonZoekParameterEnums =
  | ActiviteitLocatieaanduidingZoekParameter.ParameterEnum
  | DivisieannotatieZoekParameter.ParameterEnum
  | DocumentregeltekstZoekParameter.ParameterEnum
  | HoofdlijnZoekParameter.ParameterEnum
  | KaartZoekParameter.ParameterEnum
  | OntwerpActiviteitLocatieaanduidingZoekParameter.ParameterEnum
  | OntwerpDivisieannotatieZoekParameter.ParameterEnum
  | OntwerpRegeltekstZoekParameter.ParameterEnum
  | RegeltekstZoekParameter.ParameterEnum;

type OzonZoekWaardeTypes = string[];

export interface ZoekParameters {
  parameter: OzonZoekParameterEnums;
  zoekWaarden: OzonZoekWaardeTypes;
}

export interface PostBodyOzon {
  geo?: GeoJsonZoekObject;
  zoekParameters?: ZoekParameters[];
}

export enum LOCATIE_ID_TYPE {
  locatieIdentificatie = 'locatie.identificatie',
  OntwerplocatieTechnischId = 'ontwerplocatie.technischId',
}

export type LocatieIdType = LOCATIE_ID_TYPE.locatieIdentificatie | LOCATIE_ID_TYPE.OntwerplocatieTechnischId;

export enum RegelgevingInstructie {
  INSTRUMENT = 'instructieregelInstrument',
  TAAKUITOEFENING = 'instructieregelTaakuitoefening',
}

export class FilterUtils {
  public static getPostBodyOzonFromFilters(
    locatieIdType: LocatieIdType,
    locatieIds: string[],
    options: FilterOptions,
    url: string
  ): PostBodyOzon {
    const postBodyOzon: PostBodyOzon = {
      zoekParameters: options ? FilterUtils.zoekParametersFromFilter(options, url) : [],
    };
    if (locatieIdType === LOCATIE_ID_TYPE.locatieIdentificatie) {
      postBodyOzon.zoekParameters.push({
        parameter: LOCATIE_ID_TYPE.locatieIdentificatie,
        zoekWaarden: locatieIds,
      });
    }

    if (locatieIdType === LOCATIE_ID_TYPE.OntwerplocatieTechnischId) {
      postBodyOzon.zoekParameters.push({
        parameter: LOCATIE_ID_TYPE.OntwerplocatieTechnischId,
        zoekWaarden: locatieIds,
      });
    }

    /* Filter empty zoekParameters */
    postBodyOzon.zoekParameters = postBodyOzon.zoekParameters.filter(item => item !== null);

    return postBodyOzon;
  }

  public static zoekParametersFromFilter(options: FilterOptions, url: string): ZoekParameters[] {
    const zoekParameters: ZoekParameters[] = [];

    zoekParameters.push(
      ...FilterUtils.getZoekParameterFromFilter(options[FilterName.ACTIVITEIT], 'activiteit.identificatie')
    );

    zoekParameters.push(...FilterUtils.getZoekParameterFromFilter(options[FilterName.THEMA], 'thema.code'));

    zoekParameters.push(...FilterUtils.getZoekParameterFromDocumentType(options[FilterName.DOCUMENT_TYPE]));

    zoekParameters.push(...FilterUtils.getZoekParametersFromRegelgevingtype(options[FilterName.REGELGEVING_TYPE], url));

    return zoekParameters;
  }

  public static getZoekParameterFromFilter(
    filters: FilterIdentification[],
    parameter: OzonZoekParameterEnums,
    zoekWaardeProperty: keyof FilterIdentification = 'id'
  ): ZoekParameters[] {
    const zoekParameters: ZoekParameters[] = [];

    if (filters?.length > 0) {
      zoekParameters.push({
        parameter,
        zoekWaarden: filters.map(f => f[zoekWaardeProperty] as string),
      });
    }

    return zoekParameters;
  }

  public static getZoekParameterFromDocumentType(filters: FilterIdentification[]): ZoekParameters[] {
    const zoekParameters: ZoekParameters[] = [];

    if (filters?.length > 0) {
      const ozonDocumentTypes = filters.filter(documenttype =>
        documenttype.applicableToSources.includes(ApiSource.OZON)
      );

      zoekParameters.push(...FilterUtils.getZoekParameterFromFilter(ozonDocumentTypes, 'document.type', 'ozonValue'));
    }

    return zoekParameters;
  }

  public static getZoekParametersFromRegelgevingtype(filters: FilterIdentification[], url: string): ZoekParameters[] {
    const zoekParameters: ZoekParameters[] = [];

    if (filters?.length > 0) {
      const regelgevingTypesForOzon = (filters as RegelgevingtypeFilter[]).filter(regelgevingtype =>
        regelgevingtype.applicableToSources.includes(ApiSource.OZON)
      );

      const regelgevingInstructies = regelgevingTypesForOzon
        .filter(item =>
          [RegelgevingInstructie.INSTRUMENT as string, RegelgevingInstructie.TAAKUITOEFENING as string].includes(
            item.id
          )
        )
        .filter(x => x.items.some(i => i.selected));

      // Indien er een instrument of adressaat is geselecteerd moet de id daarvan als waarde van de zoekParameter
      // worden gezet
      if (this.isInstructieregelsAllowed(url) && regelgevingInstructies.length > 0) {
        regelgevingInstructies.forEach(item => {
          zoekParameters.push({
            parameter: item.id as RegeltekstZoekParameter.ParameterEnum,
            zoekWaarden: [item.items.filter(i => i.selected)[0].id],
          });
        });
      }

      // Indien er minimaal 1 instructieRegel is geselecteerd dan slechts 1x de ozonValue toevoegen aan regeltekst.type,
      // daarom wordt de array uniek gemaakt middels de Set
      if (this.isRegeltekstTypeAllowed(url) && regelgevingTypesForOzon.length > 0) {
        const zoekWaarden = [...new Set(regelgevingTypesForOzon.map(item => item.ozonValue))];

        zoekParameters.push({
          parameter: RegeltekstZoekParameter.ParameterEnum.RegeltekstType,
          zoekWaarden,
        });
      }

      // Indien er minimaal 1 instructieRegel is geselecteerd dan slechts 1x de ozonValue toevoegen aan
      // ontwerpregeltekst.type, daarom wordt de array uniek gemaakt middels de Set
      if (this.isOntwerpRegeltekstTypeAllowed(url) && regelgevingTypesForOzon.length > 0) {
        const zoekWaarden = [...new Set(regelgevingTypesForOzon.map(item => item.ozonValue))];

        zoekParameters.push({
          parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.OntwerpregeltekstType,
          zoekWaarden,
        });
      }
    }

    return zoekParameters;
  }

  public static getNameForRegelgevingType(regelgevingType: RegelgevingtypeFilter): string {
    if (regelgevingType.items?.length) {
      const selectedItems = regelgevingType.items.filter(i => i.selected);
      if (selectedItems.length) {
        return `Instructieregels voor ${selectedItems[0].name.toLowerCase()}`;
      } else {
        return `Instructieregels voor ${regelgevingType.labelAllItems.toLowerCase()}`;
      }
    } else {
      return regelgevingType.name;
    }
  }

  private static isRegeltekstTypeAllowed(url: string): boolean {
    return (
      !url.includes('/ontwerp') &&
      (url.includes(activiteitZoekUrl) ||
        url.includes(documentregeltekstZoekUrl) ||
        url.includes(gebiedsaanwijzingZoekUrl) ||
        url.includes(omgevingsnormZoekUrl) ||
        url.includes(omgevingswaardeZoekUrl) ||
        url.includes(regeltekstZoekUrl))
    );
  }

  private static isOntwerpRegeltekstTypeAllowed(url: string): boolean {
    return (
      url.includes('/ontwerp') &&
      (url.includes(ontwerpDocumentregeltekstZoekUrl) || url.includes(ontwerpRegeltekstZoekUrl))
    );
  }

  private static isInstructieregelsAllowed(url: string): boolean {
    return (
      url.includes(regeltekstZoekUrl) ||
      url.includes(ontwerpRegeltekstZoekUrl) ||
      url.includes(documentregeltekstZoekUrl) ||
      url.includes(ontwerpDocumentregeltekstZoekUrl)
    );
  }
}
