import { RouterTestingModule } from '@angular/router/testing';
import { ThemaComponent } from './thema.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { of } from 'rxjs';
import { themasMock } from '~viewer/documenten/+state/themas/themas.selectors.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { documentDtoMock } from '~viewer/documenten/types/documentDto.mock';

describe('ThemaContainerComponent', () => {
  let spectator: Spectator<ThemaComponent>;
  const spyOnFilterDocumentWithThema = jasmine.createSpy('spyOnFilterDocumentWithThema');

  const createComponent = createComponentFactory({
    component: ThemaComponent,
    imports: [RouterTestingModule],
    providers: [
      mockProvider(DocumentenFacade, {
        setStructuurelementFilter: spyOnFilterDocumentWithThema,
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.component.document = documentDtoMock;
    spectator.component.themas = [];
    spectator.component.routerLink$ = of('../');
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show themas when resolved', () => {
    spectator.component.themas = themasMock;
    spectator.fixture.detectChanges();
    const themas = spectator.queryAll('button');

    expect(themas.length).toEqual(3);
    expect(themas[0].innerHTML).toEqual(' Thema 1 ');
  });

  it('should click on thema', () => {
    spectator.component.themas = themasMock;
    spectator.fixture.detectChanges();
    const themas = spectator.queryAll('button');

    expect(themas.length).toEqual(3);
    spectator.click(themas[0]);

    expect(spyOnFilterDocumentWithThema).toHaveBeenCalledWith({
      id: '/akn/nl/act/documentId',
      document: {
        documentId: '/akn/nl/act/documentId',
        documentType: 'Omgevingsplan',
      },
      beschrijving: 'Thema 1',
      themaId: '001',
      filterType: 'thema',
    });
  });
});
