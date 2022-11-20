import { LoadingState } from '~model/loading-state.enum';
import { Regeling } from '~ozon-model/regeling';
import * as fromVMSelectors from './document-vm.selectors';
import { EntityPayload } from '~general/utils/state/entity-action';
import { ApiSource } from '~model/internal/api-source';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { Plan } from '~ihr-model/plan';
import { Bestuurslaag, DocumentVM } from '~viewer/documenten/types/documenten.model';
import { DocumentSubPages } from '../types/document-pages';
import { DocumentType } from '~viewer/documenten/types/document-types';

describe('Document VM selectors', () => {
  describe('getDocumentenVM', () => {
    const documentId = 'blaat';
    let document: EntityPayload<{ ozon: Regeling; ihr: Plan }>;
    const derivedLoadingState: DerivedLoadingState = {
      isLoading: false,
      isIdle: false,
      isPending: false,
      isResolved: true,
      isRejected: false,
      isLoaded: true,
    };

    beforeEach(() => {
      document = {
        entityId: documentId,
        status: LoadingState.RESOLVED,
        data: {
          ihr: undefined,
          ozon: {
            identificatie: documentId,
            type: { code: 'omgevingsvisie', waarde: 'omgevingsvisie' },
            aangeleverdDoorEen: {
              naam: 'Gemeente Utrecht',
              bestuurslaag: '',
              code: '1234',
            },
            geregistreerdMet: {
              beginInwerking: '1-1-2020',
              beginGeldigheid: '1-1-2020',
              tijdstipRegistratie: '',
            },
            citeerTitel: 'testCiteerTitel',
            officieleTitel: 'testOfficieleTitel',
            opschrift: 'Beste geit op stal met grote oren',
            heeftRegelingsgebied: null,
            publicatieID: 'https://publicatie',
            _links: {
              self: {
                href: 'https://geit.test/blaat',
              },
              documentstructuur: {
                href: 'https://geit.test/blaat/structuur',
              },
              heeftRegelingsgebied: {
                href: 'https://geit.test/blaat/regelingsGebied',
              },
            },
          },
        },
      };
    });

    it('should return loading status when status is Pending', () => {
      expect(
        fromVMSelectors
          .getDocumentenVM(documentId)
          .projector({ ...derivedLoadingState, isResolved: false, isPending: true, isLoading: true, isLoaded: false })
      ).toEqual({
        documentId: documentId,
        bevoegdGezag: null,
        subPages: [],
        errorStatus: null,
        statusDateLine: null,
        loadingState: {
          isLoading: true,
          isIdle: false,
          isPending: true,
          isResolved: false,
          isRejected: false,
          isLoaded: false,
        },
        apiSource: null,
        title: null,
        type: null,
      });
    });

    it('should return document view model with status is resolved', () => {
      expect(fromVMSelectors.getDocumentenVM(documentId).projector(derivedLoadingState, document).documentId).toEqual(
        documentId
      );

      expect(fromVMSelectors.getDocumentenVM(documentId).projector(derivedLoadingState, document).loadingState).toEqual(
        derivedLoadingState
      );
    });

    it('should return subpages', () => {
      const documentVM: DocumentVM = {
        documentId: documentId,
        loadingState: derivedLoadingState,
        type: 'omgevingsvisie',
        title: 'testCiteerTitel',
        apiSource: ApiSource.OZON,
        statusDateLine: '',
        subPages: [
          DocumentSubPages.themas,
          DocumentSubPages.beleid,
          DocumentSubPages.bijlage,
          DocumentSubPages.kaarten,
        ],
        bevoegdGezag: {
          naam: 'leukeplaats',
          code: 'gm123',
          bestuurslaag: Bestuurslaag.GEMEENTE,
        },
      };

      expect(fromVMSelectors.getDocumentenSubPages(documentId).projector(documentVM)).toEqual([
        DocumentSubPages.themas,
        DocumentSubPages.beleid,
        DocumentSubPages.bijlage,
        DocumentSubPages.kaarten,
      ]);
    });

    it('should return no subpages', () => {
      expect(fromVMSelectors.getDocumentenSubPages(documentId).projector(undefined)).toEqual([]);
    });

    it('should return filter tab routerlink', () => {
      const documentVM: DocumentVM = {
        documentId: documentId,
        loadingState: derivedLoadingState,
        type: DocumentType.omgevingsVisie,
        title: 'testCiteerTitel',
        apiSource: ApiSource.OZON,
        subPages: [],
        statusDateLine: '',
        bevoegdGezag: {
          naam: 'leukeplaats',
          code: 'gm123',
          bestuurslaag: Bestuurslaag.GEMEENTE,
        },
      };

      expect(fromVMSelectors.getDocumentenVMFilterTabRouterLink(documentId).projector(documentVM)).toEqual('../beleid');

      documentVM.type = 'instructie';

      expect(fromVMSelectors.getDocumentenVMFilterTabRouterLink(documentId).projector(documentVM)).toEqual('../beleid');

      documentVM.type = DocumentType.amvb;

      expect(fromVMSelectors.getDocumentenVMFilterTabRouterLink(documentId).projector(documentVM)).toEqual('../regels');

      documentVM.type = DocumentType.ministerieleRegeling;

      expect(fromVMSelectors.getDocumentenVMFilterTabRouterLink(documentId).projector(documentVM)).toEqual('../regels');
      documentVM.type = DocumentType.omgevingsverordening;

      expect(fromVMSelectors.getDocumentenVMFilterTabRouterLink(documentId).projector(documentVM)).toEqual('../regels');
      documentVM.type = DocumentType.waterschapsverordening;

      expect(fromVMSelectors.getDocumentenVMFilterTabRouterLink(documentId).projector(documentVM)).toEqual('../regels');
      documentVM.type = DocumentType.omgevingsPlan;

      expect(fromVMSelectors.getDocumentenVMFilterTabRouterLink(documentId).projector(documentVM)).toEqual('../regels');
      documentVM.type = DocumentType.voorbeschermingsregels;

      expect(fromVMSelectors.getDocumentenVMFilterTabRouterLink(documentId).projector(documentVM)).toEqual('../regels');
      documentVM.type = DocumentType.aanwijzingsbesluitn2000;

      expect(fromVMSelectors.getDocumentenVMFilterTabRouterLink(documentId).projector(documentVM)).toEqual('../regels');
      documentVM.type = DocumentType.toegangsbeperkingsbesluit;

      expect(fromVMSelectors.getDocumentenVMFilterTabRouterLink(documentId).projector(documentVM)).toEqual('../regels');
      documentVM.type = DocumentType.programma;

      expect(fromVMSelectors.getDocumentenVMFilterTabRouterLink(documentId).projector(documentVM)).toEqual('../beleid');

      documentVM.type = DocumentType.projectBesluit;

      expect(fromVMSelectors.getDocumentenVMFilterTabRouterLink(documentId).projector(documentVM)).toEqual('../');

      documentVM.type = '';

      expect(fromVMSelectors.getDocumentenVMFilterTabRouterLink(documentId).projector(documentVM)).toEqual('../');
    });
  });
});
