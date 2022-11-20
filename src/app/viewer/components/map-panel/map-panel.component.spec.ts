import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapPanelComponent } from '~viewer/components/map-panel/map-panel.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MapPanelComponent', () => {
  let component: MapPanelComponent;
  let fixture: ComponentFixture<MapPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapPanelComponent],
      imports: [BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    it('should change panelState', () => {
      spyOn(component.closeEventEmitter, 'emit');
      component.close();

      expect(component.closeEventEmitter.emit).toHaveBeenCalled();
    });
  });

  describe('handleKeyboardEvent', () => {
    it('should ignore keys other than "Tab" and "Escape"', () => {
      spyOn(component, 'close');
      window.document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space' }));

      expect(component.close).not.toHaveBeenCalled();
    });

    it('should close when "Escape" is pressed and panelstate is "in"', () => {
      spyOn(component, 'close');
      window.document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape' }));

      expect(component.close).toHaveBeenCalled();
    });

    describe('when "Tab" is Pressed', () => {
      it('should not close', () => {
        spyOn(component, 'close');
        window.document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab' }));

        expect(component.close).not.toHaveBeenCalled();
      });
    });

    describe('when ""Shift "Tab" is Pressed', () => {
      it('should not close', () => {
        component.closeButton.nativeElement.focus();
        spyOn(component, 'close');
        window.document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', shiftKey: true }));

        expect(component.close).not.toHaveBeenCalled();
      });
    });
  });
});
