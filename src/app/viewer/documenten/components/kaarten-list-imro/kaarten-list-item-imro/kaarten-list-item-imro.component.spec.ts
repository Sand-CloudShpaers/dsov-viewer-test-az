import { KaartenListItemImroComponent } from './kaarten-list-item-imro.component';
import { MapDetailsFacade } from '~viewer/documenten/+state/map-details.facade';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LinkHandlerDirective } from '~general/directives/link-handler/link-handler.directive';
import { MockDirective } from 'ng-mocks';
import { IMROCartografieInfoDetailVM } from '~viewer/documenten/types/map-details';

describe('KaartenListItemImroComponent', () => {
  let spectator: Spectator<KaartenListItemImroComponent>;
  const spyOnAddHighlight = jasmine.createSpy('spyOnAddHighlight');
  const spyOnRemoveHighlight = jasmine.createSpy('spyOnRemoveHighlight');

  const item: IMROCartografieInfoDetailVM = {
    categorie: 'Enkelbestemming',
    classificatie: '',
    naam: undefined,
    id: 'e32',
    themas: ['thema1', 'thema2'],
    symboolcode: 'enkelbestemming_maatschappelijk',
    type: 'Enkelbestemming',
    labels: ['enkelbestemming wonen'],
    selected: true,
  };

  const createComponent = createComponentFactory({
    component: KaartenListItemImroComponent,
    declarations: [MockDirective(LinkHandlerDirective)],
    providers: [
      MapDetailsFacade,
      mockProvider(MapDetailsFacade, {
        addHighlight: spyOnAddHighlight,
        removeHighlight: spyOnRemoveHighlight,
        getMaatvoeringLabels$: () => of(['maatschappelijk']),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(async () => {
    spectator = createComponent({ detectChanges: false });
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('Item with a single label', () => {
    beforeEach(async () => {
      spectator.setInput({ item: item });
      spectator.component.labels$ = of([]);
      spectator.detectComponentChanges();
    });

    it('should set labels and show list without links', done => {
      spectator.component.ngOnInit();

      spectator.component.labels$.subscribe(data => {
        spectator.detectComponentChanges();

        expect(data).toEqual(['enkelbestemming wonen']);
        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-text__naam"]')).toHaveLength(1);
        expect(spectator.query('[data-test-id="ihr-map-details__item-text__naam"]').innerHTML).toContain(
          'enkelbestemming wonen'
        );

        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-themas"]')).toHaveLength(1);

        done();
      });
    });

    it('should set labels voor maatvoering and show list wihtout links', done => {
      spectator.setInput({ item: { ...item, type: 'Maatvoering' } });
      spectator.detectComponentChanges();
      spectator.component.ngOnInit();
      spectator.component.labels$.subscribe(data => {
        spectator.detectComponentChanges();

        expect(data).toEqual(['maatschappelijk']);
        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-text__naam"]')).toHaveLength(1);
        expect(spectator.query('[data-test-id="ihr-map-details__item-text__naam"]').innerHTML).toContain(
          'maatschappelijk'
        );

        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-themas"]')).toHaveLength(1);

        done();
      });
    });

    it('should set labels with a single internal link', done => {
      spectator.setInput({
        item: {
          ...item,
          internalLinks: [{ id: 'id', href: 'href' }],
          externalLinks: ['enkelbestemming wonen'],
        },
      });
      spectator.detectComponentChanges();
      spectator.component.ngOnInit();
      spectator.component.labels$.subscribe(data => {
        spectator.detectComponentChanges();

        expect(data).toEqual(['enkelbestemming wonen']);
        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-text__internalLink"]')).toHaveLength(1);
        expect(spectator.query('[data-test-id="ihr-map-details__item-text__internalLink"]').innerHTML).toContain(
          'enkelbestemming wonen'
        );

        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-themas"]')).toHaveLength(1);

        done();
      });
    });

    it('should set labels with a list of multiple internal links', done => {
      spectator.setInput({
        item: {
          ...item,
          internalLinks: [
            { id: 'id', href: 'href' },
            { id: 'id2', href: 'href2' },
          ],
          externalLinks: ['enkelbestemming wonen', 'ext_link2'],
        },
      });
      spectator.detectComponentChanges();
      spectator.component.ngOnInit();
      spectator.component.labels$.subscribe(data => {
        spectator.detectComponentChanges();

        expect(data).toEqual(['enkelbestemming wonen']);
        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-text__internalLink"]')).toHaveLength(2);
        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-text__internalLink"]')[0].innerHTML).toContain(
          'Verwijzing 1'
        );

        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-text__internalLink"]')[1].innerHTML).toContain(
          'Verwijzing 2'
        );

        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-themas"]')).toHaveLength(1);

        done();
      });
    });

    it('should set labels with a single external link', done => {
      spectator.setInput({ item: { ...item, externalLinks: ['enkelbestemming wonen'] } });
      spectator.detectComponentChanges();
      spectator.component.ngOnInit();
      spectator.component.labels$.subscribe(data => {
        spectator.detectComponentChanges();

        expect(data).toEqual(['enkelbestemming wonen']);
        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-text__externalLink"]')).toHaveLength(1);
        expect(spectator.query('[data-test-id="ihr-map-details__item-text__externalLink"]').innerHTML).toContain(
          'enkelbestemming wonen'
        );

        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-themas"]')).toHaveLength(1);

        done();
      });
    });

    it('should set labels with a list of multiple external links', done => {
      spectator.setInput({
        item: { ...item, externalLinks: ['enkelbestemming wonen', 'ext_link2'] },
      });
      spectator.detectComponentChanges();
      spectator.component.ngOnInit();
      spectator.component.labels$.subscribe(data => {
        spectator.detectComponentChanges();

        expect(data).toEqual(['enkelbestemming wonen']);
        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-text__externalLink"]')).toHaveLength(2);
        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-text__externalLink"]')[0].innerHTML).toContain(
          'Verwijzing 1'
        );

        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-text__externalLink"]')[1].innerHTML).toContain(
          'Verwijzing 2'
        );

        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-themas"]')).toHaveLength(1);

        done();
      });
    });

    it('should return comma seperated list of themas', () => {
      spectator.component.getThemas();

      expect(spectator.component.getThemas()).toEqual('thema1, thema2');
    });
  });

  describe('Item with a multiple labels', () => {
    beforeEach(async () => {
      spectator.setInput({ item: { ...item, labels: item.labels.concat('label2') } });
      spectator.component.labels$ = of([]);
      spectator.detectComponentChanges();
    });

    it('should show item name and list of labels without links', done => {
      spectator.component.ngOnInit();

      spectator.component.labels$.subscribe(data => {
        spectator.detectComponentChanges();

        expect(data).toEqual(['enkelbestemming wonen', 'label2']);
        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-text__naam"]')).toHaveLength(2);
        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-text__naam"]')[0].innerHTML).toContain(
          'enkelbestemming wonen'
        );

        expect(spectator.queryAll('[data-test-id="ihr-map-details__item-text__naam"]')[1].innerHTML).toContain(
          'label2'
        );

        done();
      });
    });
  });

  describe('Highlight and slider', () => {
    it('should addHighlight', () => {
      spectator.component.addHighlight('123');

      expect(spyOnAddHighlight).toHaveBeenCalled();
    });

    it('should emit sliderToggled after slider is toggled', () => {
      spyOn(spectator.component.sliderToggled, 'next');
      spectator.component.onToggleSlider(item, false, 1);

      expect(spectator.component.sliderToggled.next).toHaveBeenCalledWith({
        item: item,
        checked: false,
        groupKey: 1,
      });
    });

    it('should removeHighlight', () => {
      spectator.component.removeHighlight();

      expect(spyOnRemoveHighlight).toHaveBeenCalled();
    });
  });

  describe('trackByListItem', () => {
    it('should return the label of the listitem', () => {
      expect(spectator.component.trackByLabel(123, '123')).toBe('123');
    });
  });

  describe('trackByVerwijzing', () => {
    it('should return verwijzing', () => {
      expect(spectator.component.trackByVerwijzing(123, '123')).toBe('123');
    });
  });
});
