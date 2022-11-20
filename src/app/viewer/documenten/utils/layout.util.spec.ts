import { createDerivedLayoutStateActive, createDerivedLayoutStateOpen } from './layout.util';
import { LayoutState } from '../types/layout.model';

describe('layout util', () => {
  describe('createDerivedLayoutStateOpen', () => {
    it('undefined results in false', () => {
      const result = createDerivedLayoutStateOpen(undefined);

      expect(result).toEqual({
        isClosed: false,
        isOpen: false,
      });
    });

    it('null results in false', () => {
      const result = createDerivedLayoutStateOpen(null);

      expect(result).toEqual({
        isClosed: false,
        isOpen: false,
      });
    });

    it('OPEN results in isOpen true', () => {
      const result = createDerivedLayoutStateOpen(LayoutState.OPEN);

      expect(result).toEqual({
        isClosed: false,
        isOpen: true,
      });
    });

    it('CLOSED results in isClosed true', () => {
      const result = createDerivedLayoutStateOpen(LayoutState.CLOSED);

      expect(result).toEqual({
        isClosed: true,
        isOpen: false,
      });
    });

    it('ACTIVE results in false', () => {
      const result = createDerivedLayoutStateOpen(LayoutState.ACTIVE);

      expect(result).toEqual({
        isClosed: false,
        isOpen: false,
      });
    });
  });

  describe('createDerivedLayoutStateActive', () => {
    it('undefined results in false', () => {
      const result = createDerivedLayoutStateActive(undefined);

      expect(result).toEqual({
        isActive: false,
        isNotActive: false,
      });
    });

    it('null results in false', () => {
      const result = createDerivedLayoutStateActive(null);

      expect(result).toEqual({
        isActive: false,
        isNotActive: false,
      });
    });

    it('ACTIVE results in initialActive true', () => {
      const result = createDerivedLayoutStateActive(LayoutState.ACTIVE);

      expect(result).toEqual({
        isActive: true,
        isNotActive: false,
      });
    });

    it('INACTIVE results in isNotActive true', () => {
      const result = createDerivedLayoutStateActive(LayoutState.INACTIVE);

      expect(result).toEqual({
        isActive: false,
        isNotActive: true,
      });
    });

    it('OPEN results in false true', () => {
      const result = createDerivedLayoutStateActive(LayoutState.OPEN);

      expect(result).toEqual({
        isActive: false,
        isNotActive: false,
      });
    });
  });
});
