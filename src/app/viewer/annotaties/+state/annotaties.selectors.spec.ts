import * as fromSelectors from './annotaties.selectors';
import {
  hoofdlijnenEntityMock,
  locatiesResponseMock,
  omgevingsnormenEntityMock,
  omgevingswaardenEntityMock,
  ontwerpLocatiesResponseMock,
} from '~viewer/annotaties/mocks/annotaties.mocks';
import { annotatieHoofdlijnenVMMock } from './hoofdlijnen/hoofdlijnen.mock';
import { LoadingState } from '~model/loading-state.enum';
import { derivedLoadingState } from '~general/utils/store.utils';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { BestemmingsplanFeatureEntitiesMock } from './bestemminsplan-features/bestemmingsplan-features.mock';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { IdealisatieFeatureEntitiesMock } from './idealisatie/idealisatie.reducer.spec';
import { getAnnotationEntityId } from '../helpers/annotaties';
import { AnnotationId } from '~viewer/documenten/types/annotation';

export const mockAnnotationId: AnnotationId = { identificatie: 'regeltekstId', elementId: 'elementId' };
export const mockAnnotationEntityId = getAnnotationEntityId(mockAnnotationId);
export const mockAnnotationEntityIdOntwerp = getAnnotationEntityId({
  ...mockAnnotationId,
  technischId: 'technischId',
});
export const mockAnnotationEntityIdIhr = getAnnotationEntityId({ identificatie: 'tekstId', elementId: 'tekstId' });

describe('AnnotatiesSelectors', () => {
  describe('getLocatiesById', () => {
    it('should return LocatieVM[] with werkingsgebieden alphabetically sorted by noemer', () => {
      expect(
        fromSelectors
          .getLocatiesById({
            identificatie: 'regeltekstId',
            elementId: 'elementId',
          })
          .projector({
            [mockAnnotationEntityId]: {
              data: {
                elementId: 'elementId',
                entityId: mockAnnotationEntityId,
                vastgesteld: locatiesResponseMock,
                status: LoadingState.RESOLVED,
              },
            },
          })
      ).toEqual([
        {
          identificatie: 'gebied-zonder-noemer',
          naam: '',
          isOntwerp: false,
          isSelected: false,
          symboolcode: 'werkingsgebied',
        },
        {
          identificatie: 'gebied-met-lege-noemer',
          naam: '',
          isOntwerp: false,
          isSelected: false,
          symboolcode: 'werkingsgebied',
        },
        {
          identificatie: 'gebied-moet-vooraan',
          naam: 'a-gebied',
          isOntwerp: false,
          isSelected: false,
          symboolcode: 'werkingsgebied',
        },
        {
          identificatie: 'test-gebied',
          naam: 'test',
          isOntwerp: false,
          isSelected: false,
          symboolcode: 'werkingsgebied',
        },
      ]);
    });

    it('should return empty list when not found', () => {
      expect(
        fromSelectors.getLocatiesById({ ...mockAnnotationId, identificatie: 'iets-anders' }).projector({
          [mockAnnotationEntityId]: {
            data: {
              elementId: 'elementId',
              entityId: mockAnnotationEntityId,
              vastgesteld: locatiesResponseMock,
              status: LoadingState.RESOLVED,
            },
          },
        })
      ).toEqual([]);
    });

    it('should return LocatieVM[], for ontwerp', () => {
      expect(
        fromSelectors
          .getLocatiesById({
            identificatie: 'regeltekstId',
            elementId: 'elementId',
          })
          .projector({
            [mockAnnotationEntityId]: {
              data: {
                elementId: 'elementId',
                entityId: mockAnnotationEntityId,
                ontwerp: ontwerpLocatiesResponseMock,
                status: LoadingState.RESOLVED,
              },
            },
          })
      ).toEqual([
        {
          identificatie: '1234',
          naam: 'test',
          isOntwerp: true,
          isSelected: false,
          symboolcode: 'werkingsgebied',
        },
      ]);
    });
  });

  describe('getHoofdlijnenById ', () => {
    it('should return hoofdlijnen grouped by soort', () => {
      expect(
        fromSelectors
          .getHoofdlijnenById({
            identificatie: 'regeltekstId',
            elementId: 'elementId',
          })
          .projector({
            [getAnnotationEntityId({
              identificatie: 'regeltekstId',
              elementId: 'elementId',
            })]: {
              entityId: getAnnotationEntityId({
                identificatie: 'regeltekstId',
                elementId: 'elementId',
              }),
              data: hoofdlijnenEntityMock,
              status: LoadingState.RESOLVED,
            },
          })
      ).toEqual([annotatieHoofdlijnenVMMock]);
    });
  });

  describe('selectOmgevingswaardenById ', () => {
    it('should return loading state', () => {
      expect(
        fromSelectors
          .getOmgevingswaardenStatusById({
            identificatie: 'regeltekstId',
            elementId: 'elementId',
          })
          .projector(omgevingswaardenEntityMock)
      ).toEqual(derivedLoadingState(LoadingState.RESOLVED));
    });

    it('should return omgevingswaarden', () => {
      expect(
        fromSelectors
          .selectOmgevingswaardenById({
            identificatie: 'regeltekstId',
            elementId: 'elementId',
          })
          .projector(omgevingswaardenEntityMock)
      ).toEqual([
        {
          identificatie: 'typeCode',
          naam: 'type',
          normen: [
            {
              identificatie: 'id',
              naam: 'Testwaarde',
              eenheid: '',
              type: 'type',
              normType: NormType.OMGEVINGSWAARDEN,
              normwaarden: [
                {
                  identificatie: 'normwaardeId',
                  naam: 'waarde op de kaart',
                  representationLabel: 'waarde op de kaart',
                  isOntwerp: false,
                  isSelected: false,
                  symboolcode: undefined,
                },
              ],
            },
          ],
        },
      ]);
    });
  });

  describe('selectOmgevingsnormenById ', () => {
    it('should return loading state', () => {
      expect(
        fromSelectors
          .getOmgevingsnormenStatusById({
            identificatie: 'regeltekstId',
            elementId: 'elementId',
          })
          .projector(omgevingsnormenEntityMock)
      ).toEqual(derivedLoadingState(LoadingState.RESOLVED));
    });

    it('should return omgevingsnormen', () => {
      expect(
        fromSelectors
          .selectOmgevingsnormenById(
            {
              identificatie: 'regeltekstId',
              elementId: 'elementId',
            },
            DocumentViewContext.VOLLEDIG_DOCUMENT
          )
          .projector(omgevingsnormenEntityMock)
      ).toEqual([
        {
          identificatie: 'typeCode',
          naam: 'type',
          normen: [
            {
              identificatie: 'id',
              naam: 'Testnorm',
              eenheid: '',
              type: 'type',
              normType: NormType.OMGEVINGSNORMEN,
              normwaarden: [
                {
                  identificatie: 'normwaardeId',
                  naam: 'waarde op de kaart',
                  representationLabel: 'waarde op de kaart',
                  isOntwerp: false,
                  isSelected: false,
                  symboolcode: undefined,
                },
              ],
            },
          ],
        },
      ]);
    });
  });

  describe('getBestemmingsplanFeaturesById ', () => {
    it('should return loading state', () => {
      expect(
        fromSelectors
          .getBestemmingsplanFeaturesStatusById({
            identificatie: 'NL.IMRO.PT.regels._3_Agrarisch-1',
            elementId: 'NL.IMRO.PT.regels._3_Agrarisch-1',
          })
          .projector(BestemmingsplanFeatureEntitiesMock)
      ).toEqual(derivedLoadingState(LoadingState.RESOLVED));
    });

    it('should return BestemmingsplanFeatureGroupVM', () => {
      expect(
        fromSelectors
          .getBestemmingsplanFeaturesById({
            identificatie: 'NL.IMRO.PT.regels._3_Agrarisch-1',
            elementId: 'NL.IMRO.PT.regels._3_Agrarisch-1',
          })
          .projector(BestemmingsplanFeatureEntitiesMock)
      ).toEqual([
        {
          id: 'Bestemmingsvlakken',
          objectType: SelectionObjectType.BESTEMMINGSVLAK,
          features: [
            {
              id: 'NL.IMRO.e6c3f7a586ac46e49251312072dcbe92',
              naam: 'Agrarisch - 1',
              symboolcode: 'enkelbestemming_agrarisch',
              isSelected: false,
              locatieIds: ['NL.IMRO.e6c3f7a586ac46e49251312072dcbe92'],
            },
          ],
        },
        {
          id: 'Gebiedsaanduidingen',
          objectType: SelectionObjectType.GEBIEDSAANDUIDING,
          features: [
            {
              id: 'NL.IMRO.e6c3f7a586ac46ewewqeerewrewr',
              naam: 'aanduiding',
              symboolcode: 'gebiedsaanduiding_groep',
              isSelected: false,
              locatieIds: ['NL.IMRO.e6c3f7a586ac46ewewqeerewrewr', 'NL.IMRO.e6c3f7a586ac46ewewqeerewrewr'],
            },
          ],
        },
      ]);
    });
  });

  describe('getIdealisatieById ', () => {
    it('should return loading state', () => {
      expect(
        fromSelectors.getIdealisatieStatusById(mockAnnotationId).projector(IdealisatieFeatureEntitiesMock)
      ).toEqual(derivedLoadingState(LoadingState.RESOLVED));
    });

    it('should return true', () => {
      expect(fromSelectors.getIdealisatieById(mockAnnotationId).projector(IdealisatieFeatureEntitiesMock)).toBeTrue();
    });

    it('should return false', () => {
      expect(
        fromSelectors
          .getIdealisatieById({ ...mockAnnotationId, identificatie: mockAnnotationId.identificatie + '2' })
          .projector(IdealisatieFeatureEntitiesMock)
      ).toBeFalse();
    });
  });
});
