import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { DocumentElementTitleComponent } from './document-element-title.component';
import { DocumentBodyElement, DocumentBodyElementType } from '~viewer/documenten/types/documenten.model';
import { PipesModule } from '~general/pipes/pipes.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { documentBodyElementOzonMock } from '~viewer/documenten/mocks/document-body-element';

describe('DocumentElementTitleComponent', () => {
  let spectator: SpectatorHost<DocumentElementTitleComponent>;

  const createHost = createHostFactory({
    component: DocumentElementTitleComponent,
    imports: [PipesModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createHost<{ documentBodyElement: DocumentBodyElement; isOpen: boolean }>(
      `<dsov-document-element-title
        [documentBodyElement]="documentBodyElement"
        [isOpen]="isOpen"
      ></dsov-document-element-title>`,
      {
        hostProps: {
          documentBodyElement: documentBodyElementOzonMock,
          isOpen: true,
        },
      }
    );
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should return h-tags based on SoortEnum', () => {
    const mockElement = documentBodyElementOzonMock;
    mockElement.type = DocumentBodyElementType.HOOFDSTUK;
    spectator.setHostInput({ documentBodyElement: mockElement });
    spectator.component.ngOnInit();
    spectator.detectChanges();

    expect(spectator.query('h2')).toExist();
    expect(spectator.query('h3')).toBeNull();
    mockElement.type = DocumentBodyElementType.TITEL;
    spectator.setHostInput({ documentBodyElement: mockElement });
    spectator.component.ngOnInit();
    spectator.detectChanges();

    expect(spectator.query('h3')).toExist();
    expect(spectator.query('h2')).toBeNull();
    mockElement.type = DocumentBodyElementType.AFDELING;
    spectator.setHostInput({ documentBodyElement: mockElement });
    spectator.component.ngOnInit();
    spectator.detectChanges();

    expect(spectator.query('h4')).toExist();
    expect(spectator.query('h3')).toBeNull();
    mockElement.type = DocumentBodyElementType.PARAGRAAF;
    spectator.setHostInput({ documentBodyElement: mockElement });
    spectator.component.ngOnInit();
    spectator.detectChanges();

    expect(spectator.query('h5')).toExist();
    expect(spectator.query('h4')).toBeNull();
    mockElement.type = DocumentBodyElementType.SUBPARAGRAAF;
    spectator.setHostInput({ documentBodyElement: mockElement });
    spectator.component.ngOnInit();
    spectator.detectChanges();

    expect(spectator.query('h5')).toExist();
    mockElement.type = DocumentBodyElementType.SUBSUBPARAGRAAF;
    spectator.setHostInput({ documentBodyElement: mockElement });
    spectator.component.ngOnInit();
    spectator.detectChanges();

    expect(spectator.query('h5')).toExist();
    mockElement.type = DocumentBodyElementType.ARTIKEL;
    spectator.setHostInput({ documentBodyElement: mockElement });
    spectator.component.ngOnInit();
    spectator.detectChanges();

    expect(spectator.query('h6')).toExist();
    expect(spectator.query('h5')).toBeNull();
    mockElement.type = undefined;
    spectator.setHostInput({ documentBodyElement: mockElement });
    spectator.component.ngOnInit();
    spectator.detectChanges();

    expect(spectator.query('p')).toExist();
    expect(spectator.query('h6')).toBeNull();
  });

  it('should return h-tags when soort = DIVISIETEKST', () => {
    expect(spectator.component.getTagName(DocumentBodyElementType.DIVISIETEKST, 2)).toEqual('h2');
    expect(spectator.component.getTagName(DocumentBodyElementType.DIVISIETEKST, 3)).toEqual('h3');
    expect(spectator.component.getTagName(DocumentBodyElementType.DIVISIETEKST, 4)).toEqual('h4');
    expect(spectator.component.getTagName(DocumentBodyElementType.DIVISIETEKST, 5)).toEqual('h5');
    expect(spectator.component.getTagName(DocumentBodyElementType.DIVISIETEKST, 6)).toEqual('h6');
    expect(spectator.component.getTagName(DocumentBodyElementType.DIVISIETEKST, 7)).toEqual('p');
  });

  it('should set disabled class when disabled', () => {
    const mockElement = documentBodyElementOzonMock;
    mockElement.type = DocumentBodyElementType.HOOFDSTUK;
    mockElement.layout.isActive = false;
    spectator.setHostInput({ documentBodyElement: mockElement });
    spectator.component.ngOnInit();
    spectator.detectChanges();

    expect(spectator.query('.document-element__titel-header-item')).toHaveClass('disabled');
  });

  it('should only show prefix and suffix, when no content', () => {
    const mockElement: DocumentBodyElement = {
      ...documentBodyElementOzonMock,
      type: DocumentBodyElementType.HOOFDSTUK,
      nummer: '2',
      titel: {
        content: '',
        prefix: DocumentBodyElementType.HOOFDSTUK,
        suffix: '[gereserveerd]',
      },
    };
    spectator.setHostInput({ documentBodyElement: mockElement });
    spectator.component.ngOnInit();
    spectator.detectChanges();

    expect(spectator.query('[data-test-id="document-element-titel__text"]')).toHaveText('HOOFDSTUK 2  [gereserveerd]');
  });

  it('should should return "Tekst open / dicht klappen"', () => {
    expect(spectator.component.getTitleAttribute(false)).toEqual('Tekst open klappen');
    expect(spectator.component.getTitleAttribute(true)).toEqual('Tekst dicht klappen');
  });
});
