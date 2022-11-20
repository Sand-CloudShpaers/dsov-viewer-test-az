import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { DocumentStructuurPageComponent } from '~viewer/documenten/+pages/document-structuur-page/document-structuur-page.component';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { of } from 'rxjs';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { documentDtoMock } from '~viewer/documenten/types/documentDto.mock';

const urlSegment: UrlSegment = {
  path: 'regels',
  parameters: {},
  parameterMap: null,
};

describe('DocumentStructuurPageComponent', () => {
  let spectator: Spectator<DocumentStructuurPageComponent>;
  const spyOnShowSelectionsOnMap = jasmine.createSpy('spyOnShowSelectionsOnMap');

  const createComponent = createComponentFactory({
    component: DocumentStructuurPageComponent,
    providers: [
      mockProvider(DocumentenFacade),
      RouterTestingModule,
      {
        provide: ActivatedRoute,
        useValue: {
          url: of([urlSegment]),
        },
      },
      mockProvider(SelectionFacade, { showSelectionsOnMap: spyOnShowSelectionsOnMap }),
    ],
    declarations: [MockComponent(DocumentStructuurPageComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();

    spectator.component.documentDto$ = of(documentDtoMock);
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeDefined();
  });

  it('should show selection on map', () => {
    spectator.component.ngOnInit();

    expect(spyOnShowSelectionsOnMap).toHaveBeenCalled();
  });

  it('should show dsov-document-structuur-container', () => {
    expect('dsov-document-structuur-container').toExist();
  });
});
