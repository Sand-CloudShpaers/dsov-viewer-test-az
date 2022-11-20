import { RouterTestingModule } from '@angular/router/testing';
import { HoofdlijnContainerComponent } from './hoofdlijn-container.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { of } from 'rxjs';
import { mockHoofdlijnen } from '~viewer/documenten/+state/hoofdlijnen/hoofdlijnen.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HoofdlijnVM } from '~viewer/documenten/+state/hoofdlijnen/hoofdlijnen.model';
import { documentDtoMock } from '~viewer/documenten/types/documentDto.mock';

describe('HoofdlijnContainerComponent', () => {
  let spectator: Spectator<HoofdlijnContainerComponent>;
  const spyOnFilterDocumentWithHoofdlijn = jasmine.createSpy('spyOnFilterDocumentWithHoofdlijn');

  const hoofdlijnMapMock = {
    testgroep: mockHoofdlijnen,
  } as any;

  const createComponent = createComponentFactory({
    component: HoofdlijnContainerComponent,
    imports: [RouterTestingModule],
    providers: [
      mockProvider(DocumentenFacade, {
        setStructuurelementFilter: spyOnFilterDocumentWithHoofdlijn,
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.component.document = documentDtoMock;
    spectator.component.hoofdlijnen = {} as Record<string, HoofdlijnVM[]>;
    spectator.component.routerLink$ = of('../');
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show hoofdlijnen when resolved', () => {
    spectator.component.hoofdlijnen = hoofdlijnMapMock;
    spectator.fixture.detectChanges();
    const hoofdlijnGroupEls = spectator.queryAll('button');

    expect(hoofdlijnGroupEls.length).toEqual(1);
    expect(hoofdlijnGroupEls[0].getAttribute('title')).toEqual('testgroep weergeven');
    spectator.click(hoofdlijnGroupEls[0]);
    const hoofdlijnEls = spectator.queryAll('button');

    expect(hoofdlijnEls.length).toEqual(2);
    expect(hoofdlijnEls[1].innerHTML).toEqual(' hfst 1 ');
  });

  it('should click on hoofdlijnen', () => {
    spectator.component.hoofdlijnen = hoofdlijnMapMock;
    spectator.fixture.detectChanges();
    const hoofdlijnGroupEls = spectator.queryAll('button');

    expect(hoofdlijnGroupEls.length).toEqual(1);
    spectator.click(hoofdlijnGroupEls[0]);

    const hoofdlijnEls = spectator.queryAll('button');
    spectator.click(hoofdlijnEls[1]);

    expect(spyOnFilterDocumentWithHoofdlijn).toHaveBeenCalledWith({
      id: '/akn/nl/act/documentId',
      document: {
        documentId: '/akn/nl/act/documentId',
        documentType: 'Omgevingsplan',
      },
      beschrijving: 'hfst 1',
      hoofdlijnId: 'nl.imow-gm0983.hoofdlijn.VRKOVhfst1',
      filterType: 'hoofdlijn',
    });
  });
});
