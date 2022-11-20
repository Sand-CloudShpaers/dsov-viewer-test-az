import { DerivedLayoutStateActive, DerivedLayoutStateOpen, LayoutState } from '../types/layout.model';

export function createDerivedLayoutStateOpen(state: LayoutState): DerivedLayoutStateOpen {
  return {
    isOpen: state === LayoutState.OPEN,
    isClosed: state === LayoutState.CLOSED,
  };
}

export function createDerivedLayoutStateActive(state: LayoutState): DerivedLayoutStateActive {
  return {
    isActive: state === LayoutState.ACTIVE,
    isNotActive: state === LayoutState.INACTIVE,
  };
}
