import { DocumentListSectionComponent } from './document-list-section.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';
import { of } from 'rxjs';
import { DocumentListItemVM } from '~viewer/filtered-results/types/document-list-item';
import { ApiSource } from '~model/internal/api-source';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { SelectionObjectType } from '~store/common/selection/selection.model';

export const documentListItemsVMMock: DocumentListItemVM[] = [
  {
    id: '123',
    documentType: 'Bestemmingsplan',
    isOntwerp: false,
    title: 'bestemmingsplan',
    bestuurslaag: Bestuurslaag.GEMEENTE,
    bevoegdGezagCode: 'gm123',
    bevoegdGezagNaam: 'gemeente 123',
    typeOwnerLine: 'Bestemmingsplan - Gemeente 123',
    statusDateLine: 'Geldig vanaf 30-03-2020',
    status: 'vestgesteld',
    regelStatus: 'geldend',
    apiSource: ApiSource.IHR,
    sortDate: new Date('1-1-2020'),
    bundle: [
      {
        id: '123',
        name: 'Document',
        apiSource: ApiSource.IHR,
        objectType: SelectionObjectType.REGELINGSGEBIED,
        documentDto: {
          documentId: '123',
          documentType: 'Bestemmingsplan',
        },
      },
    ],
  },
  {
    id: '789',
    documentType: 'Provinciale verordening',
    isOntwerp: false,
    title: 'Provinciale verordening',
    bestuurslaag: Bestuurslaag.PROVINCIE,
    bevoegdGezagCode: 'pv456',
    bevoegdGezagNaam: 'provincie 456',
    typeOwnerLine: 'Provinciale verordening - provincie 456',
    statusDateLine: 'Geldig vanaf 03-09-2019',
    status: 'geconsolideerd',
    regelStatus: 'geldend',
    apiSource: ApiSource.IHR,
    sortDate: new Date('1-2-2019'),
    bundle: [
      {
        id: '789',
        name: 'Document',
        apiSource: ApiSource.IHR,
        objectType: SelectionObjectType.REGELINGSGEBIED,
        documentDto: {
          documentId: '789',
          documentType: 'Provinciale verordening',
        },
      },
    ],
  },
  {
    id: '456',
    documentType: 'Omgevingsverordening',
    isOntwerp: false,
    title: 'Omgevingsverordening',
    bestuurslaag: Bestuurslaag.PROVINCIE,
    bevoegdGezagCode: 'pv456',
    bevoegdGezagNaam: 'provincie 456',
    typeOwnerLine: 'Omgevingsverordening - provincie 456',
    statusDateLine: 'In werking vanaf 05-11-2021',
    status: 'vastgesteld',
    regelStatus: 'geldend',
    apiSource: ApiSource.OZON,
    sortDate: new Date('1-2-2020'),
    bundle: [
      {
        id: '456',
        name: 'Document',
        apiSource: ApiSource.OZON,
        objectType: SelectionObjectType.REGELINGSGEBIED,
        documentDto: {
          documentId: '456',
          documentType: 'Omgevingsverordening',
        },
      },
      {
        id: '1011',
        name: 'Document',
        apiSource: ApiSource.OZON,
        objectType: SelectionObjectType.REGELINGSGEBIED,
        isOntwerp: true,
        documentDto: {
          documentId: '1011',
          documentType: 'Omgevingsverordening',
        },
      },
    ],
  },
  {
    id: '1012',
    documentType: 'Omgevingsplan',
    isOntwerp: false,
    title: 'Omgevingsplan',
    bestuurslaag: Bestuurslaag.GEMEENTE,
    bevoegdGezagCode: 'pv456',
    bevoegdGezagNaam: 'provincie 456',
    typeOwnerLine: 'Omgevingsplan - provincie 456',
    statusDateLine: 'In werking vanaf 05-12-2030',
    status: 'ontwerp',
    regelStatus: 'ontwerp',
    apiSource: ApiSource.OZON,
    sortDate: new Date('1-2-2020'),
    bundle: [
      {
        id: '1012',
        name: 'Document',
        apiSource: ApiSource.OZON,
        isOntwerp: true,
        objectType: SelectionObjectType.REGELINGSGEBIED,
        documentDto: {
          documentId: '1012',
          documentType: 'Omgevingsplan',
        },
      },
    ],
  },
];

describe('DocumentListSectionComponent', () => {
  let spectator: Spectator<DocumentListSectionComponent>;

  const spyOnLoadMore = jasmine.createSpy('loadMore').and.stub();
  const spyOnShowFilterPanel = jasmine.createSpy('showFilterPanel').and.stub();

  const createComponent = createComponentFactory({
    component: DocumentListSectionComponent,
    providers: [
      {
        provide: FilteredResultsFacade,
        useValue: {
          loadMore: spyOnLoadMore,
          getLoadMoreUrls$: () => of([{ bestuurslaag: Bestuurslaag.GEMEENTE, url: 'url' }]),
          getDocumentListItemsVM$: () => of(documentListItemsVMMock),
          getAllDocumentListItemsVM$: () => of([]),
          getSectionIsOpen$: () => of(true),
        },
      },
      {
        provide: FilterFacade,
        useValue: {
          showFilterPanel: spyOnShowFilterPanel,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        notAllFiltersApply: false,
        listTitle: 'title',
        bestuurslaag: Bestuurslaag.GEMEENTE,
      },
    });
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  it('should get list length', () => {
    expect(spectator.component.getListLength(documentListItemsVMMock)).toBe(4);

    spectator.component.notAllFiltersApply = true;
    spectator.detectChanges();

    expect(spectator.component.getListLength(documentListItemsVMMock)).toBe(2);
  });

  it('should return sorted documents', () => {
    expect(spectator.component.getSortedDocuments(documentListItemsVMMock)[1].typeOwnerLine).toEqual(
      'Omgevingsplan - provincie 456'
    );
  });

  it('should check on loadMore', () => {
    expect(spectator.component.canLoadMore([{ bestuurslaag: Bestuurslaag.GEMEENTE, url: 'loadMoreUrl' }])).toBeTrue();

    spectator.component.notAllFiltersApply = true;
    spectator.detectChanges();

    expect(spectator.component.canLoadMore([{ bestuurslaag: Bestuurslaag.GEMEENTE, url: 'loadMoreUrl' }])).toBeFalse();
  });

  it('shoul load more', () => {
    spectator.component.loadMoreForAllBestuurslagen([
      { bestuurslaag: Bestuurslaag.GEMEENTE, url: 'laadMeerGemeentes' },
      { bestuurslaag: Bestuurslaag.PROVINCIE, url: 'laadMeerProvincies' },
    ]);

    expect(spyOnLoadMore).toHaveBeenCalledTimes(2);
  });

  it('should track documentListItems', () => {
    expect(spectator.component.trackByDocumentListItem(1, documentListItemsVMMock[0])).toBe('123');
  });

  it('should trigger filter', () => {
    spectator.component.triggerFilter();

    expect(spyOnShowFilterPanel).toHaveBeenCalled();
  });

  it('should get filterNotApply list', done => {
    spectator.setInput('bestuurslaag', undefined);
    spectator.component.ngOnInit();

    spectator.component.documentListItems$.subscribe(list => {
      expect(list).toHaveLength(0);
      done();
    });
  });
});
